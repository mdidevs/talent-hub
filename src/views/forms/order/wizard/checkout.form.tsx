import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import type { PaymentIntent, StripeError } from "@stripe/stripe-js"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/atomic/button"
import { stripePromise } from "@/lib/stripe"
import { useWizardPricing } from "@/hooks/wizard/wizard-pricing.hook"
import { paymentService } from "@/services/payment/payment.service"
import { orderService } from "@/services/order/order.service"
import { transactionService } from "@/services/transaction/transaction.service"
import { selectUser } from "@/store/auth/auth.selector"
import { appConfig } from "@/configs/app.config"

type IntentState = {
  clientSecret: string | null
  intentId: string | null
  orderId: number | null
  orderTotal: number | null
  status: "idle" | "creating" | "ready" | "error"
  error?: string | null
}

const defaultIntentState: IntentState = {
  clientSecret: null,
  intentId: null,
  orderId: null,
  orderTotal: null,
  status: "idle",
  error: null,
}

const getErrorMessage = (err: unknown) => {
  if (typeof err === "string") return err
  if (err instanceof Error) return err.message
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message?: unknown }).message ?? "Unable to process payment.")
  }
  const maybeResponse = err as { response?: { data?: { message?: string } | string } }
  if (typeof maybeResponse?.response?.data === "string") return maybeResponse.response.data
  if (
    maybeResponse?.response?.data &&
    typeof (maybeResponse.response.data as { message?: string }).message === "string"
  ) {
    return (maybeResponse.response.data as { message: string }).message
  }
  return "Unable to process payment."
}

const CheckoutForm = () => {
  const user = useSelector(selectUser)
  const { subtotal, formatAmount, currency, hasSelections, orderItems } = useWizardPricing()
  const [intentState, setIntentState] = useState<IntentState>(defaultIntentState)

  useEffect(() => {
    let isCancelled = false

    if (!hasSelections || subtotal <= 0) {
      setIntentState(defaultIntentState)
      return
    }

    if (!orderItems.length) {
      setIntentState({
        ...defaultIntentState,
        status: "error",
        error: "Unable to map selected services to billable plans. Please refresh and try again.",
      })
      return
    }

    if (!user?.id) {
      setIntentState({
        ...defaultIntentState,
        status: "error",
        error: "Sign in to create an order before completing checkout.",
      })
      return
    }

    if (!user?.customer_id) {
      setIntentState({
        ...defaultIntentState,
        status: "error",
        error: "Your account is missing a customer profile. Contact support to continue.",
      })
      return
    }

    const customerId = user.customer_id

    if (!appConfig.stripePublishableKey) {
      setIntentState({
        ...defaultIntentState,
        status: "error",
        error: "Stripe publishable key is not configured. Set VITE_STRIPE_PUBLISHABLE_KEY in your frontend environment.",
      })
      return
    }

    setIntentState((prev) => ({
      ...prev,
      clientSecret: null,
      intentId: null,
      orderId: null,
      orderTotal: null,
      status: "creating",
      error: null,
    }))

    const prepareOrderAndIntent = async () => {
      try {
        const createdOrder = await orderService.createOrder({
          currency,
          items: orderItems,
          customer_id: customerId,
        })
        if (isCancelled) return

        const paymentIntent = await paymentService.createPaymentIntent({
          orderId: createdOrder.id,
          currency,
        })
        if (isCancelled) return

        setIntentState({
          clientSecret: paymentIntent.clientSecret,
          intentId: paymentIntent.intentId,
          orderId: createdOrder.id,
          orderTotal: Number(createdOrder.total_amount ?? subtotal),
          status: "ready",
          error: null,
        })
      } catch (error) {
        if (isCancelled) return
        setIntentState({
          ...defaultIntentState,
          status: "error",
          error: getErrorMessage(error),
        })
      }
    }

    void prepareOrderAndIntent()

    return () => {
      isCancelled = true
    }
  }, [hasSelections, subtotal, currency, orderItems, user?.id, user?.customer_id])

  const elementsOptions = useMemo(() => {
    if (!intentState.clientSecret) return undefined
    return {
      clientSecret: intentState.clientSecret,
      appearance: {
        theme: "stripe" as const,
        variables: {
          colorPrimary: "#020817",
          borderRadius: "8px",
        },
      },
    }
  }, [intentState.clientSecret])

  const formattedTotal = formatAmount(intentState.orderTotal ?? subtotal)

  const hasStripeKey = Boolean(appConfig.stripePublishableKey)
  const canRenderElements = Boolean(hasSelections && elementsOptions)
  const isWaitingForIntent = hasSelections && hasStripeKey && !canRenderElements && intentState.status === "creating"
  const missingSelections = !hasSelections
  const missingStripeKey = hasSelections && !hasStripeKey

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-background p-4 text-sm text-muted-foreground">
        {missingSelections && <p>Add at least one service before completing checkout.</p>}
        {isWaitingForIntent && <p>Preparing secure Stripe checkout…</p>}
        {missingStripeKey && <p className="text-destructive">Stripe publishable key is not configured.</p>}
        {intentState.status === "error" && intentState.error && (
          <p className="text-destructive">{intentState.error}</p>
        )}
      </div>
      {canRenderElements ? (
        <Elements stripe={stripePromise} options={elementsOptions} key={intentState.clientSecret ?? "elements"}>
          <StripePaymentFields
            amountLabel={formattedTotal}
            currency={currency}
            disabled={intentState.status !== "ready"}
            orderId={intentState.orderId}
            orderTotal={intentState.orderTotal ?? subtotal}
          />
        </Elements>
      ) : (
        <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
          {missingSelections && <p>Select at least one service to get a live total.</p>}
          {missingStripeKey && <p>Connect your Stripe publishable key to enable checkout.</p>}
          {!missingSelections && !missingStripeKey && !canRenderElements && (
            <p>Payment form will appear as soon as Stripe finishes preparing your session…</p>
          )}
        </div>
      )}
    </div>
  )
}

const StripePaymentFields = ({
  amountLabel,
  currency,
  disabled,
  orderId,
  orderTotal,
}: {
  amountLabel: string
  currency: string
  disabled: boolean
  orderId: number | null
  orderTotal: number
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const [message, setMessage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const persistPaymentIntent = async (intent: PaymentIntent) => {
    if (!orderId) {
      throw new Error("Missing order reference for transaction logging.")
    }

    const serializedIntent = JSON.parse(JSON.stringify(intent)) as Record<string, unknown>
    const minorUnits = intent.amount ?? Math.round(orderTotal * 100)
    const amountMajor = minorUnits / 100

    await transactionService.createTransaction({
      order_id: orderId,
      amount: Number(amountMajor.toFixed(2)),
      currency: (intent.currency ?? currency).toUpperCase(),
      payment_method: intent.payment_method_types?.[0] ?? "stripe",
      payment_status: intent.status,
      transaction_id: intent.id,
      transaction_data: serializedIntent,
    })
  }

  const finalizeSuccessfulPayment = async (
    intent: PaymentIntent,
    successCopy: string,
  ) => {
    try {
      await persistPaymentIntent(intent)
      setMessage(successCopy)
    } catch (persistError) {
      console.error("Failed to record transaction", persistError)
      setMessage(
        `${successCopy} We could not store the receipt automatically (ref ${intent.id}). Please contact support.`,
      )
    } finally {
      setIsComplete(true)
      setTimeout(() => navigate("/dashboard"), 1200)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!stripe || !elements || disabled || isComplete) return

    if (!orderId) {
      setMessage("Order reference not ready. Refresh the page and try again.")
      return
    }

    setIsProcessing(true)
    setMessage(null)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/checkout/complete`,
        },
        redirect: "if_required",
      })

      if (error) {
        const stripeError = error as StripeError
        const alreadySucceeded =
          stripeError.code === "payment_intent_unexpected_state" &&
          stripeError.payment_intent &&
          (stripeError.payment_intent as PaymentIntent).status === "succeeded"

        if (alreadySucceeded && stripeError.payment_intent) {
          await finalizeSuccessfulPayment(
            stripeError.payment_intent as PaymentIntent,
            "Payment already succeeded earlier. A receipt has been sent to your email.",
          )
        } else {
          setMessage(error.message ?? "Payment failed. Please try again.")
        }
      } else if (paymentIntent) {
        if (paymentIntent.status === "succeeded") {
          await finalizeSuccessfulPayment(
            paymentIntent,
            "Payment succeeded! A receipt has been sent to your email.",
          )
        } else {
          setMessage(`Payment status: ${paymentIntent.status}`)
        }
      } else {
        setMessage("Payment is processing. This page will update when Stripe finishes.")
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-md border border-border p-4">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>
      {orderId && (
        <p className="text-xs text-muted-foreground text-center">Order reference #{orderId}</p>
      )}
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
      <Button
        type="submit"
        variant="default"
        size="lg"
        disabled={disabled || isProcessing || !stripe || !elements || isComplete || !orderId}
        className="w-full"
      >
        {isProcessing ? "Processing…" : `Pay ${amountLabel}`}
      </Button>
      <p className="text-xs text-muted-foreground text-center">Securely processed via Stripe • Billed in {currency.toUpperCase()}</p>
    </form>
  )
}

export default CheckoutForm
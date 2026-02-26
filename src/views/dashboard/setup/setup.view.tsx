import { CircleQuestionMark, Mail } from "lucide-react"
import SetupList from "./setupList"
import { Link } from "react-router-dom"
import { Button } from "@/components/atomic/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atomic/card"

export const SetupView = () => {
    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="my-10 text-center">
                <h1 className="text-2xl font-medium">Get started with your cubicles!</h1>
                <p>Complete these simple steps to get your workspace up and running</p>
            </div>
            <div className="py-6 md:py-20 space-y-14 border-b border-stroke-soft-200">
                <SetupList
                    step={1}
                    title="Create your profile"
                    description="Take the first step towards making online workspace profile"
                    buttonText="Create account"
                    status={true}
                    onClick={() => alert('Create account')}
                />
                <SetupList
                    step={2}
                    title="Select support categories & professionals"
                    description="Select the number of professionals required for your operations."
                    buttonText="Choose experts"
                    status={false}
                    onClick={() => alert('Choose experts')}
                />
                <SetupList
                    step={3}
                    title="Configure seats and floor plans"
                    description="Set up your team’s seats and floor plans"
                    buttonText="Set up seats"
                    status={false}
                    onClick={() => alert('Set up seats')}
                />
                <SetupList
                    step={4}
                    title="Finalize your agreement"
                    description="Provide the legal details for this service contract and e-signature."
                    buttonText="Share Legal Info"
                    status={false}
                    onClick={() => alert('Share Legal Info')}
                />
            </div>

            <div className="my-10 text-center">
                <h1 className="text-lg font-medium">Still having questions?</h1>
                <p>We’re here to guide you every step of the way.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
                <Card className="flex-1">
                    <CardHeader>
                        <CircleQuestionMark />
                        <CardTitle className="mt-3 font-medium">Help center</CardTitle>
                        <CardDescription>
                            Step-by-step guides, quick answers to common questions.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild variant={"secondary"}>
                            <Link to='/'>Learn more</Link>
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="flex-1">
                    <CardHeader>
                        <Mail />
                        <CardTitle className="mt-3 font-medium">Contact support</CardTitle>
                        <CardDescription>
                            Email us your questions and get a reply within 24 hours.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild variant={"secondary"}>
                            <Link to='/'>Contact</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

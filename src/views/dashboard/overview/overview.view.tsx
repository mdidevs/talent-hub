import OverviewCard from "./overviewCard"
import SeatChart from "./seatChart"

const OverView = () => {
    return (
        <div className="p-4">
            <h1 className="text-xl font-normal">Overview</h1>
            <div className="my-4 grid md:grid-cols-4 gap-4">
                <OverviewCard
                    title="Active professionals"
                    value={32}
                    caption="Morning shift"
                />
                <OverviewCard
                    title="Cubicles occupied"
                    value={56}
                />
                <OverviewCard
                    title="SOC Professionals"
                    value={34}
                />
                <OverviewCard
                    title="NOC Professionals"
                    value={22}
                />
            </div>
            <SeatChart/>
        </div>
    )
}

export default OverView
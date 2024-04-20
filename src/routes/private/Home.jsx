import Device from '../../components/Device'

const Home = () => {
    const devices = [
        {name: "PS1", type: "PS5", status: true, startedAt: null },
        {name: "PS2", type: "PS5", status: true, startedAt: null },
        {name: "PS3", type: "PS5", status: true, startedAt: null },
        {name: "PS4", type: "PS5", status: false, startedAt: Date.now() + 60000 },
        {name: "PS5", type: "PS4", status: true, startedAt: null },
        {name: "PS6", type: "PS5", status: true, startedAt: null },
        {name: "PS7", type: "PS5", status: false, startedAt: Date.now() + 60000 },
    ]

    const sessions = [
        {
            deviceName: "PS4",
            startAt: Date.now() - 6500,
            play_type: "single",
            time_type: "open",
            endAt: null
        },
        {
            deviceName: "PS7",
            startAt: Date.now() - 200,
            play_type: "single",
            time_type: "open",
            endAt: null
        }
    ]

    const availableDevices = devices.filter((device)=> device.status == true )
    const unavailableDevices = devices.filter((device)=> device.status == false)

  return (
    <div className='min-h-screen w-full select-none bg-indigo-200 pb-16 '>
        <div className='w-[85%] mx-auto pt-28 flex flex-col items-center'>
            <h1 className='text-2xl font-bold text-white shadow-small bg-green-500 border-4 p-4 inline-block'>الأجهزة المتاحة</h1>
            <div className='flex w-full flex-wrap justify-center  gap-6 mt-8'>
                {availableDevices.map((device)=><Device  key={device.name} deviceData={device} />)}
            </div>
        </div>
        <div className='w-[85%] mx-auto mt-10 flex flex-col items-center'>
            <h1 className='text-2xl font-bold text-center shadow-small text-white border-4 bg-red-500 p-4 inline-block'>الأجهزة الغير متاحة</h1>
            <div className='flex w-full flex-wrap justify-center  gap-6 mt-8'>
                {unavailableDevices.map((device)=><Device  key={device.name} session={sessions.find((session)=> session.deviceName == device.name)} deviceData={device} />)}
            </div>
        </div>
    </div>
  )
}
  

export default Home
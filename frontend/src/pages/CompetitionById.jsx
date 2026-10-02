import { Badge } from '@/components/ui/badge'
import { useAuth } from "@/contexts/AuthContext";
import AuthDialog from "@/components/AuthDialog";
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowUpRight, CalendarRange, CheckCircle2Icon, Info, Send, Timer, Trophy, Upload, Users } from 'lucide-react'
import { Play } from "lucide-react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom' 
import CountdownBanner from '@/components/CountdownBanner';
import CompetitionDetails from '@/components/CompetitionDetails';
import RewardDetails from '@/components/RewardsDetails';
import api from '@/api/client';
import PreviousWinnerCard from '@/components/PrevWinnerCard';
import IsoDateconverter from '@/components/IsoDateconverter';
import Header from '@/components/Header';



const CompetitionById = () => {
    
    const {id}=useParams();
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const { user, loading: authLoading } = useAuth();
const [authOpen, setAuthOpen] = useState(false);
const [registering, setRegistering] = useState(false);
const [localUserState, setLocalUserState] = useState(null);
const [localSlotsLeft, setLocalSlotsLeft] = useState(null);
const [authIntent, setAuthIntent] = useState(null); // "login" | "register"

useEffect(() => {
  if (data) {
    setLocalUserState(data.userState);
    setLocalSlotsLeft(data.slotsLeft);
  }
}, [data]);
    useEffect(()=>{
      const fetchData=async()=>{
        try {
          const res=await api.get(`/api/competitions/${id}`)
          setData(res.data)
        } catch (error) {
          console.log(error);
        }finally{
          setLoading(false)
        }
      }
      fetchData()
    },[id])

    const formattedDates=useMemo(()=>{
      if(!data?.competition?.dates) return {}
      const {registrationCloses,submissionStarts, submissionEnds,resultDate}=
      data.competition.dates

      return {
        registrationCloses:registrationCloses ? IsoDateconverter(registrationCloses):'NA',
        submissionStarts:submissionStarts? IsoDateconverter(submissionStarts):'NA',
        submissionEnds:submissionEnds?IsoDateconverter(submissionEnds):'NA',
        resultDate:resultDate?IsoDateconverter(resultDate):'NA'
      }
    },[data])

     if (loading) return <div className="p-6">Loading…</div>;
  if (!data) return <div className="p-6 text-red-600">Competition not found</div>;

  
  const { competition, userState, slotsLeft, state } = data;

    const prevWinners =competition?.previousWinners || [];
    const loop=[...prevWinners,...prevWinners]
    const judge=competition.judge;
    const totalSlots=competition?.totalSlot || 20
    const bookedSlots=totalSlots-(slotsLeft??0)
    const progressPercent=Math.min(Math.round((bookedSlots/totalSlots)*100),100)

    const getCtaLabel = () => {
  if (userState?.isRegistered) {
    if (state === "SUBMISSION_PHASE") return "Upload Submission";
    if (state === "JUDGING") return "Under Review";
    if (state === "RESULTS_PUBLISHED") return "View Results";
    return "Registered";
  }
  else if (state === "FULL") return "Slots Full";
  else if (state === "REGISTRATION_OPEN") return "Register Now";
  else if (state === "SUBMISSION_PHASE") return "Registration Closed";
  else if (state === "JUDGING") return "Under Review";
  else if (state === "RESULTS_PUBLISHED") return "Competition Ended";
  return "Register Now";
};

const canClick =
  state === "REGISTRATION_OPEN" && userState?.canRegister;
    console.log(competition)

  const handleRegister = async () => {
  if (!user) {
    setAuthIntent("register");
    setAuthOpen(true);
    return;
  }
  setRegistering(true);
  try {
    const res = await api.post(`/api/competitions/${id}/register`);
    setLocalUserState({ isRegistered: true, canRegister: false });
    setLocalSlotsLeft(res.data.slotsLeft);
  } catch (err) {
    alert(err.response?.data?.error || "Registration failed");
  } finally {
    setRegistering(false);
  }
};
console.log(data)
  return (
    <div className=''>
    <Header onLoginClick={() => {
      setAuthIntent("login");
      setAuthOpen(true);
    }} />
    <div className='flex flex-wrap gap-4 md:p-4 p-2 md:px-26 bg-white '>
      
      <div className='flex flex-col gap-2 '>
    <div className='grow shadow-md'>
        <div className='flex flex-col bg-white border-gray-300 border-2 h-full  py-4 px-2 gap-2 rounded-xl justify-around'>
          
          <div className='flex justify-between px-3 items-center'>
            <h2 className='font-extrabold text-2xl  text-neutral-700'>{competition.title}</h2>
          
            <Button size="sm" disabled={!canClick && !userState?.isRegistered}>
              <CheckCircle2Icon className="mr-1 h-4 w-4" />
              {getCtaLabel()}
            </Button>
          </div>
          <div className='flex gap-2 items-center px-3'>
            {
              competition.tags.map((tag,idx)=>(<Badge key={idx} variant='secondary'>{tag}</Badge>))
            }
            <p className='flex items-center gap-1 text-xs text-green-800'><Trophy size={16}/> Winners get certificates</p>
        </div>
        <div className='flex items-center justify-between px-4 py-2'>
          <div className='flex gap-6'>
            <div className='flex flex-col items-center justify-center'>
            <p className='text-xs text-gray-500 font-medium'>Price Pool</p>
            <p className='text-lg text-green-900 font-semibold'>₹ {competition.prizePool.total}</p>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <p className='text-xs text-gray-500 font-medium'>Entry Fee</p>
            <p className='text-lg text-green-90 font-semibold'>₹ {competition.entryFee.amount}</p>
          </div>
          </div>
          <div className='w-[40%] flex flex-col gap-1 font-medium'>
            <p className='text-xs text-green-700 flex gap-1'>
                <Users size={'15'}/>Only {slotsLeft} spots left</p>
            <Progress value={progressPercent} />
            <p className='text-xs'>{bookedSlots}/{totalSlots} Booked</p>
          </div>
        </div>
        </div>
     </div>
     <div className='grow items-center flex shadow-md'>
        <div className='flex grow justify-between bg-white border-gray-300 border-2  py-4 px-4 gap-2 rounded-xl h-full '>
          <div className='flex gap-2 items-center '>
            <Avatar className="h-22 w-22 md:h-38 hover:w-28 active:w-28 ease-in-out transition-all duration-200 ">
                <AvatarImage src={judge.avatarUrl} alt="@shadcn" />
                
                <AvatarFallback>CN</AvatarFallback>
                <AvatarBadge className="bg-green-600 dark:bg-green-800 " />
                
            </Avatar>

            <div className='transition-all '>
                <p className='text-neutral-600 text-xs'>Judge</p>
                <p className='font-semibold'>{judge.name}</p>
                <p className='text-neutral-600 text-xs'>{judge.title}</p>
                <p className='text-neutral-600 text-xs'>{judge.experience}+ years of experience</p>
            </div>
          </div>
          <div className='items-center justify-center flex grow  transition-all '>
            <Link to={judge.introVideoUrl}>
            <button className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center transition-all group-hover:bg-neutral-100">
                <Play className="w-4 h-4 text-neutral-700 fill-neutral-700 ml-0.5" />
            </div>
            <span className="text-xs font-medium text-neutral-500 transition-all">Intro Video</span>
            </button>
            </Link>
          </div>
          
          
        </div>
        </div>
      <div className=' shadow-md'>
        <div className='flex  justify-between bg-white border-gray-300 border-2  py-4 px-4 gap-2 rounded-xl h-full '>
          <div className='flex gap-2 items-center'>
            
            
           
          </div>
          <div className='grow transition-all font-semibold items-center justify-center'>
  <p className='mb-1 px-2 font-semibold'>Important Dates</p>

  <div className='grid grid-cols-2 rounded-lg border border-gray-300 font-medium'>
    {/* Register Before */}
    <div className='flex gap-4 border-b border-r border-gray-300 px-8 py-4'>
      <CalendarRange />
      <div>
        <p className='text-gray-500 text-sm'>Register Before</p>
        <p className='font-semibold text-green-700'>
          {formattedDates.registrationCloses.fullDate}
        </p>
        <p>{formattedDates.registrationCloses.time}</p>
      </div>
    </div>

    {/* Submission Starts */}
    <div className='flex gap-4 border-b border-gray-300 px-8 py-4'>
      <Send />
      <div>
        <p className='text-gray-500 text-sm'>Submission Starts</p>
        <p className='font-semibold text-green-700'>
          {formattedDates.submissionStarts.fullDate}
        </p>
        <p>{formattedDates.submissionStarts.time}</p>
      </div>
    </div>

    {/* Submission Ends */}
    <div className='flex gap-4 border-r border-gray-300 px-8 py-4'>
      <Upload />
      <div>
        <p className='text-gray-500 text-sm'>Submission Ends</p>
        <p className='font-semibold text-green-700'>
          {formattedDates.submissionEnds.fullDate}
        </p>
        <p>{formattedDates.submissionEnds.time}</p>
      </div>
    </div>

    {/* Result Date */}
    <div className='flex gap-4 px-8 py-4'>
      <Trophy />
      <div>
        <p className='text-gray-500 text-sm'>Result Date</p>
        <p className='font-semibold text-green-700'>
          {formattedDates.resultDate.fullDate}
        </p>
        <p>{formattedDates.resultDate.time}</p>
      </div>
    </div>
  </div>
</div>
          
          
        </div>
        
        </div>
    
    </div>
    <div className='grow w-[18vw] flex-col flex gap-2 '>
      <div className='bg-green-100 text-green-900 shadow-md flex lg:h-20  rounded-lg p-4 justify-center gap-2 font-semibold border-2 border-green-500'>
        
        <CountdownBanner state={state} dates={competition.dates} />
    </div>
    <div className='shadow-md'>
        <div className='flex-col  justify-between    border-gray-300 border-2 overflow-hidden  py-4 px-4 gap-2 rounded-xl  font-medium'>
          <p className='font-semibold px-2 mb-1'>Previous Winners</p>
          <div className='[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]'>
            <div className='flex gap-3 w-max  animate-marquee hover:paused '>
            
            {
              loop.map((winner ,idx)=>{
                
                
                return (
                <PreviousWinnerCard key={idx} winner={winner}/>
              )})
            }

          </div>
          </div>
        </div>
        </div>
        <CompetitionDetails competition={competition} userState={userState}/>
    </div>
      <RewardDetails
  competition={competition}
  userState={localUserState || userState}
  state={state}
  registering={registering}
  onRegister={handleRegister}
/>
<AuthDialog
  open={authOpen}
  onOpenChange={setAuthOpen}
  onSuccess={handleRegister}
/>
    </div>
    </div>
  )
}

export default CompetitionById
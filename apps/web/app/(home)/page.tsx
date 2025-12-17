import Image from 'next/image';
import Link from 'next/link';
import GradientBlinds from "@/components/ui/GradientBlinds";
import { Button, buttonVariants } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { LuGithub } from 'react-icons/lu';

const githubURL = "https://github.com/ArjunAmbavane01/cospace";

export default async function page() {


    return (
        <>
            <nav className='flex justify-between absolute top-8 inset-x-0 w-full max-w-3xl mx-auto p-3 px-5 rounded-lg bg-white/10 backdrop-blur-md border border-[rgba(255,255,255,0.1)] z-50'>
                <div className='flex items-center gap-3'>
                    <Logo />
                    <h3 className='text-white'>CoSpace</h3>
                </div>
                <div className='flex items-center gap-3'>
                    <a
                        href={githubURL}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button variant={"outline"} size={"icon"}><LuGithub /></Button>
                    </a>
                </div>
            </nav>
            <main className="flex h-screen w-full overflow-hidden relative">
                <div className="absolute inset-0 z-0">
                    <GradientBlinds
                        gradientColors={['#FF9FFC', '#5227FF']}
                        angle={20}
                        noise={0.4}
                        blindCount={16}
                        blindMinWidth={60}
                        spotlightRadius={0.5}
                        spotlightSoftness={1}
                        spotlightOpacity={1}
                        mouseDampening={0.15}
                        distortAmount={0}
                        shineDirection="left"
                        mixBlendMode="lighten"
                    />
                </div>

                <div className="flex flex-col items-center justify-start gap-8 h-screen w-full pt-40 max-w-7xl mx-auto relative">
                    <div className="flex flex-col gap-2 text-center animate-fade-in-delay max-w-4xl">
                        <h1 className="text-5xl text-white font-light leading-relaxed text-balance z-10">
                            Where teams meet, work, and connect
                        </h1>
                        <p className="text-xl text-gray-300 w-fit mx-auto z-10">
                            Experience real-time collaboration in your virtual workspace
                        </p>
                    </div>

                    <Link href="/hub" className={buttonVariants({ size: 'lg', className: "bg-white text-black! z-10 text-base! hover:bg-white/90 border" })}>
                        Try Demo
                    </Link>

                    {/* App Preview Image  */}
                    <div className="absolute top-[60%] inset-x-0 animate-slide-up w-4xl mx-auto z-10">
                        <div className="relative rounded-t-2xl overflow-hidden shadow-2xl shadow-white/20 border-t-4 border-x-4 border-white/30">
                            {/* Mockup browser bar */}
                            <div className="bg-[rgb(10,10,10)] backdrop-blur-sm px-4 py-3 flex items-center gap-2 border-b border-gray-700/50">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="flex-1 ml-4 bg-[rgba(255,255,255,0.15)] rounded px-3 py-1 text-xs text-muted-foreground">
                                    https://cospace-web.vercel.app/
                                </div>
                            </div>

                            <div className="relative bg-[rgb(10,10,10)]">
                                <Image
                                    src="/game-demo.png"
                                    alt="App Screenshot"
                                    width={1400}
                                    height={800}
                                    className="object-fill"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
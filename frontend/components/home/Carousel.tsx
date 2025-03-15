"use client";

import * as React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useRouter } from "next/navigation";

const images: string[] = [
    "https://plus.unsplash.com/premium_photo-1701069513633-80556b382995?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1577538928305-3807c3993047?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1634564235572-cd6f37694266?q=80&w=2800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1560243563-062bfc001d68?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

export default function ImageCarousel() {
    const [currentIndex, setCurrentIndex] = React.useState<number>(0);
    const [isUserNavigating, setIsUserNavigating] = React.useState<boolean>(false);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        if (!isUserNavigating) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 3000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isUserNavigating]);

    const handleUserNavigation = (newIndex: number) => {
        setIsUserNavigating(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setCurrentIndex(newIndex);
        setTimeout(() => setIsUserNavigating(false), 5000); // Resume auto-slide after 5s
    };

    return (
        <div className="relative w-full mx-auto overflow-hidden">
            <Carousel className="relative w-full">
                <CarouselContent className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {images.map((src, index) => (
                        <CarouselItem key={index} className="h-[600px] w-full flex-shrink-0 bg-cover bg-center relative"
                            style={{ backgroundImage: `url(${src})` }}>
                            <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
                                <div className="text-center text-white">
                                    <h2 className="text-5xl font-bold mb-4">Premium Denim Collection</h2>
                                    <p className="text-xl mb-8">Discover your perfect fit</p>
                                    <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors" onClick={()=>router.push('/products')}>
                                        Shop Now
                                    </button>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md" onClick={() => handleUserNavigation((currentIndex - 1 + images.length) % images.length)} />
                <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md" onClick={() => handleUserNavigation((currentIndex + 1) % images.length)} />
            </Carousel>
        </div>
    );
}

 "use client";

 import { useEffect, useState, useCallback } from "react";
 import { Card } from "@/components/ui/card";
 import { Slider } from "@/components/ui/slider";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { PlayIcon, PauseIcon, RefreshCwIcon } from "lucide-react";

 interface RainDrop {
   x: number;
   y: number;
   color: string;
   length: number;
 }

 export default function RainGrid() {
   const [raindrops, setRaindrops] = useState<RainDrop[]>([]);
   const [isPlaying, setIsPlaying] = useState(true);
   const [speed, setSpeed] = useState(1.4);
   const [density, setDensity] = useState(0.01);
   const [gridSize, setGridSize] = useState({ width: 40, height: 25 });

   //different and unique colors
   const colors = [
      "#FF0000",
      "#FF7F00",
      "#FFFF00",
      "#00FF00",
      "#0000FF",
      "#4B0082",
      "#9400D3",
    
   ]; 
 
  const createRaindrop = useCallback(
    (x: number, y: number = -1): RainDrop => {
      const colorIndex = Math.floor(Math.random() * colors.length);
      const color = colors[colorIndex];
      const nextColor = colors[(colorIndex + 1) % colors.length];
      const gradient = `linear-gradient(${color}, ${nextColor})`;
      
      return {
        x,
        y,
        color: gradient,
        length: Math.floor(Math.random() * 3) + 6, // Random length between 4 and 6
      };
    },
    [colors]
  );
   useEffect(() => {
     if (!isPlaying) return;

     const interval = setInterval(() => {
       setRaindrops((prevDrops) => {
         // Move existing raindrops down
         const movedDrops = prevDrops
           .map((drop) => ({
             ...drop,
             y: drop.y + 1,
           }))
           .filter((drop) => drop.y < gridSize.height + drop.length);

         // Add new raindrops at the top
         const newDrops = Array.from({ length: gridSize.width })
           .map((_, x) => {
             if (
               Math.random() < density &&
               !movedDrops.some((drop) => drop.x === x && drop.y < 0)
             ) {
               return createRaindrop(x);
             }
             return null;
           })
           .filter((drop): drop is RainDrop => drop !== null);

         return [...movedDrops, ...newDrops];
       });
     }, 100 / speed);

     return () => clearInterval(interval);
   }, [isPlaying, speed, density, gridSize, createRaindrop]);

   const handleReset = () => {
     setRaindrops([]);
     setIsPlaying(true);
   };

   return (
     <div className="min-h-screen bg-black p-8 flex flex-col items-center gap-8">
       <Card className="p-8 bg-zinc-900 border-zinc-800">
         <div className="flex flex-col gap-8">
           <div
             className="grid gap-[1px] bg-zinc-800"
             style={{
               gridTemplateColumns: `repeat(${gridSize.width}, 20px)`,
               gridTemplateRows: `repeat(${gridSize.height}, 20px)`,
             }}
           >
             {Array.from({ length: gridSize.height * gridSize.width }).map(
               (_, i) => {
                 const x = i % gridSize.width;
                 const y = Math.floor(i / gridSize.width);
                 const raindrop = raindrops.find(
                   (drop) =>
                     drop.x === x && y >= drop.y && y < drop.y + drop.length
                 );
                  //  console.log(raindrop?.color);
                 return (
                   <div
                     key={i}
                     className="w-5 h-5 transition-colors duration-200"
                     style={{
                       background: raindrop ? raindrop.color : "#000000",
                        
                     }}
                   />
                 );
               }
             )}
           </div>

           <div className="grid gap-4">
             <div className="flex items-center gap-4">
               <Button
                 variant="outline"
                 size="icon"
                 onClick={() => setIsPlaying(!isPlaying)}
               >
                 {isPlaying ? (
                   <PauseIcon className="h-4 w-4" />
                 ) : (
                   <PlayIcon className="h-4 w-4" />
                 )}
               </Button>
               <Button variant="outline" size="icon" onClick={handleReset}>
                 <RefreshCwIcon className="h-4 w-4" />
               </Button>
             </div>

             <div className="space-y-2 text-white">
               <Label>Speed</Label>
               <Slider
                 value={[speed]}
                 onValueChange={([value]) => setSpeed(value)}
                 min={0.1}
                 max={3}
                 step={0.1}
               />
             </div>

             <div className="space-y-2 text-white">
               <Label>Density</Label>
               <Slider
                 value={[density]}
                 onValueChange={([value]) => setDensity(value)}
                 min={0.01}
                 max={0.1}
                 step={0.01}
               />
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label className="text-white">Width</Label>
                 <Input
                   type="number"
                   value={gridSize.width}
                   onChange={(e) =>
                     setGridSize((prev) => ({
                       ...prev,
                       width: parseInt(e.target.value) || 1,
                     }))
                   }
                   min={1}
                   max={50}
                 />
               </div>
               <div className="space-y-2">
                 <Label className="text-white">Height</Label>
                 <Input
                   type="number"
                   value={gridSize.height}
                   onChange={(e) =>
                     setGridSize((prev) => ({
                       ...prev,
                       height: parseInt(e.target.value) || 1,
                     }))
                   }
                   min={1}
                   max={50}
                 />
               </div>
             </div>
           </div>
         </div>
       </Card>
     </div>
   );
 }


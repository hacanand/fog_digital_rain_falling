'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlayIcon, PauseIcon, RefreshCwIcon } from 'lucide-react'

interface Drop {
  x: number
  y: number
  color: string
}

export default function RainGrid() {
  const [drops, setDrops] = useState<Drop[]>([])
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [density, setDensity] = useState(0.3)
  const [gridSize, setGridSize] = useState({ width: 40, height: 25 })

  const colors = ['#4834d4', '#686de0'] // Blue and purple colors

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setDrops(prevDrops => {
        // Move existing drops down
        const movedDrops = prevDrops
          .map(drop => ({
            ...drop,
            y: drop.y + 1
          }))
          .filter(drop => drop.y < gridSize.height)

        // Add new drops at the top
        const newDrops = Array.from({ length: gridSize.width }).map((_, x) => ({
          x,
          y: 0,
          color: Math.random() < density ? colors[Math.floor(Math.random() * colors.length)] : 'transparent'
        }))

        return [...movedDrops, ...newDrops.filter(drop => drop.color !== 'transparent')]
      })
    }, 100 / speed)

    return () => clearInterval(interval)
  }, [isPlaying, speed, density, gridSize])

  const handleReset = () => {
    setDrops([])
    setIsPlaying(true)
  }

  return (
    <div className="min-h-screen bg-black p-8 flex flex-col items-center gap-8">
      <Card className="p-8 bg-zinc-900 border-zinc-800">
        <div className="flex flex-col gap-8">
          <div 
            className="grid gap-[1px] bg-zinc-800" 
            style={{
              gridTemplateColumns: `repeat(${gridSize.width}, 20px)`,
              gridTemplateRows: `repeat(${gridSize.height}, 20px)`
            }}
          >
            {Array.from({ length: gridSize.height * gridSize.width }).map((_, i) => {
              const x = i % gridSize.width
              const y = Math.floor(i / gridSize.width)
              const drop = drops.find(d => d.x === x && d.y === y)
              
              return (
                <div
                  key={i}
                  className="w-5 h-5 transition-colors duration-200"
                  style={{
                    backgroundColor: drop ? drop.color : '#000'
                  }}
                />
              )
            })}
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleReset}
              >
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
                min={0.1}
                max={1}
                step={0.1}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Width</Label>
                <Input
                  type="number"
                  value={gridSize.width}
                  onChange={(e) => setGridSize(prev => ({ ...prev, width: parseInt(e.target.value) || 1 }))}
                  min={1}
                  max={50}
                />
              </div>
              <div className="space-y-2">
                <Label>Height</Label>
                <Input
                  type="number"
                  value={gridSize.height}
                  onChange={(e) => setGridSize(prev => ({ ...prev, height: parseInt(e.target.value) || 1 }))}
                  min={1}
                  max={50}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}


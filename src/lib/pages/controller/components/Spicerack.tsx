import { useContext, useState } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { DataContext } from "@/lib/contexts/DataContext";
import { socket } from '@/lib/utils/utils';
import { List } from 'lucide-react';


function Spicerack() {
    const [registrants, setRegistrants] = useState<any>(null)
    const [file, setFile] = useState<File | null>(null)
    const [selectedPlayer1, setSelectedPlayer1] = useState<any>(null)
    const [selectedPlayer2, setSelectedPlayer2] = useState<any>(null)
    const { data } = useContext(DataContext);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = async () => {
        if (!file) return
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            const data = JSON.parse(text);
            setRegistrants(data);
        }
        reader.readAsText(file);
    }
    
    const handlePrefill = () => {
        if (selectedPlayer1 && selectedPlayer2) {
            console.log("Selected player 1 decklist:", selectedPlayer1.decklist?.plaintext_list);
            console.log("Selected player 2 decklist:", selectedPlayer2.decklist?.plaintext_list);
            
            const newData = {
                ...data,
                p1name: `${selectedPlayer1.user.best_identifier}`,
                p2name: `${selectedPlayer2.user.best_identifier}`,
                p1deck: selectedPlayer1.decklist?.archetype,
                p2deck: selectedPlayer2.decklist?.archetype,
                p1decklist: selectedPlayer1.decklist?.plaintext_list,
                p2decklist: selectedPlayer2.decklist?.plaintext_list,
                deckviewstate: "p1"
            };
            console.log("Emitting new data:", newData);
            socket.emit("update_data", {...newData });
        }
    }

    if (!registrants) {
        return (
            <Card className="h-full w-full">
                <CardHeader>
                    <CardTitle>Import Registrants from Spicerack</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-1.5">
                        <Input id="spicerack-registrants" type="file" onChange={handleFileChange} />                        
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmit} className="w-full">Submit</Button>
                </CardFooter>
            </Card>
        )
    } else return (
        <Card className="h-full w-full">
            <CardHeader>
                <CardTitle>Import Registrants from Spicerack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Label>Player 1</Label>
                <div className="flex flex-row gap-2">
                    <Select value={selectedPlayer1?.id} onValueChange={(value) => {
                        const player = registrants.find((r: any) => r.id === value);
                        setSelectedPlayer1(player);
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Player 1" />
                        </SelectTrigger>
                        <SelectContent>
                            {registrants.map((registrant: any) => (
                                <SelectItem key={registrant.id} value={registrant.id}>
                                    {registrant.user.first_name} {registrant.user.last_name} - {registrant.decklist?.archetype}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <HoverCard>
                        <HoverCardTrigger>
                            <Button variant="outline">
                                <List />
                            </Button>
                        </HoverCardTrigger>
                        <HoverCardContent side="top" align="start" className="max-h-[500px] overflow-y-auto">
                            <div className="flex flex-col gap-2">
                                <p className="whitespace-pre text-sm">{selectedPlayer1?.decklist?.plaintext_list}</p>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                </div>
                <br />
                <Label>Player 2</Label>
                <div className="flex flex-row gap-2">
                    <Select value={selectedPlayer2?.id} onValueChange={(value) => {
                        const player = registrants.find((r: any) => r.id === value);
                        setSelectedPlayer2(player);
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Player 2" />
                        </SelectTrigger>
                        <SelectContent>
                            {registrants.map((registrant: any) => (
                                <SelectItem key={registrant.id} value={registrant.id}>
                                    {registrant.user.first_name} {registrant.user.last_name} - {registrant.decklist?.archetype}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <HoverCard>
                        <HoverCardTrigger>
                            <Button variant="outline">
                                <List />
                            </Button>
                        </HoverCardTrigger>
                        <HoverCardContent side="top" align="start" className="max-h-[500px] overflow-y-auto">
                            <div className="flex flex-col gap-2">
                                <p className="whitespace-pre text-sm">{selectedPlayer2?.decklist?.plaintext_list}</p>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handlePrefill} className="w-full">Submit</Button>
            </CardFooter>
        </Card>
    );
}

export default Spicerack;

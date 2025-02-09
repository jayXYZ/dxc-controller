import { useState } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Spicerack() {
    const [tournamentID, setTournamentID] = useState<string>('')
    const [cookie, setCookie] = useState<string>('')
    const [data, setData] = useState<any>(null)



    const url = `https://cors-anywhere.herokuapp.com/https://hydra.spicerack.gg/api/wizards-magic-events/${tournamentID}/get_registrations_admin/?statuses=COMPLETE%2CDROPPED%2CDISQUALIFIED%2CELIMINATED%2CCANCELED%2CIN_WAITING_ROOM%2CMOVED_TO_CHILD_EVENT&include_deaths=true`;
    const options = {
        method: 'GET',
        headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            cookie: cookie,
            dnt: '1',
            priority: 'u=1, i',
            'sec-ch-ua': '"Not?A_Brand";v="99", "Chromium";v="130"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
        }
    };

    const handleSubmit = async () => {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
        setData(data);
    }
    
    if (data) {
        return (
            <div>
                <h1>Spicerack Integration</h1>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        )
    } else return (
        <div>
            <h1>Spicerack Integration</h1>
            <Input
                placeholder='Tournament ID'
                onChange={(e) => setTournamentID(e.target.value)}
                value={tournamentID}
            />
            <Input
                placeholder='Cookie'
                onChange={(e) => setCookie(e.target.value)}
                value={cookie}
            />
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
    );
}

export default Spicerack;

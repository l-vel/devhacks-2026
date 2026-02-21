import { useEffect, useState } from "react";
import { PieChart } from '@mui/x-charts/PieChart';

import { ActivityCalendar } from 'react-activity-calendar'
import { Container, Row, Col } from 'react-bootstrap';
import { numKnownWords, numSeenWords, toggleKnownWord } from './storage.js';



export default function DataVisualization() {

  const [numSeen, setNumSeen] = useState(0);
  const [numKnown, setNumKnown] = useState(0);

  const calendarTheme: ThemeInput = {
  light: ['#EBD4CB', '#B6465F'],
  }

  const data = [
    {
      date: '2025-06-23',
      count: 2,
      level: 1,
    },
    {
      date: '2025-08-02',
      count: 16,
      level: 4,
    },
    {
      date: '2025-11-29',
      count: 11,
      level: 3,
    },
  ]
  useEffect(() => {
    async function loadStats() {
      toggleKnownWord('no');
      const seenWords = await numSeenWords();
      const knownWords = await numKnownWords();

      setNumSeen(seenWords);
      setNumKnown(knownWords);
    }

    loadStats();

  }, [])


  return (
    <div>
        <Row>
          <div>Seen words: {numSeen}</div>

          <div>Known words: {numKnown}</div>
        </Row>

        <Row className="mt-4">
          <Col>
            <div className='text-center'>Beginner words</div>
            <PieChart
              colors={["#B6465F", " #DA9F93", "#EBD4CB"]}
              series={[
                {
                  data: [
                    { id: 0, value: 500, label: 'Known Words' },
                    { id: 1, value: 250, label: 'Seen Words' },
                    { id: 2, value: 1500, label: 'Unknown Words' },
                  ],
                },
              ]}
              width={200}
              height={200}
            />
          </Col>

          <Col>
            <div>Intermediate words</div>
            <PieChart
              colors={["#B6465F", " #DA9F93", "#EBD4CB"]}
              series={[
                {
                  data: [
                    { id: 0, value: 50, label: 'Known Words' },
                    { id: 1, value: 80, label: 'Seen Words' },
                    { id: 2, value: 1500, label: 'Unknown Words' },
                  ],
                },
              ]}
              width={200}
              height={200}
            />
          </Col>

          <Col>
            <div>Advanced words</div>
            <PieChart
              colors={["#B6465F", " #DA9F93", "#EBD4CB"]}
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: 'Known Words' },
                    { id: 1, value: 20, label: 'Seen Words' },
                    { id: 2, value: 1500, label: 'Unknown Words' },
                  ],
                },
              ]}
              width={200}
              height={200}
            />
          </Col>
        </Row>
        <Row className="mt-4">
          <div className = "mt-4"> Activity for the Year</div>
           <Col className="d-flex justify-content-center mt-4">
          <ActivityCalendar 
            data={data} 
            theme= {calendarTheme}  
            blockSize={14}
            blockMargin={4}
            fontSize={14}/>
          </Col>
        </Row>
        
      
     
    </div>

  )

}
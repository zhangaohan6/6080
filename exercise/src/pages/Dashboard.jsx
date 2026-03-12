import { useState, useEffect } from 'react'


function Dashboard() {

    const [score,setScore] = useState(0)

    useEffect(()=> {
        const saved = localStorage.getItem('score')
        if(saved !== null) {
            setScore(Number(saved))
        } else {
            fetch('https://jsonplaceholder.typicode.com/todos/1')
                .then(r=> r.json())
                .then(data => {
                    setScore(data.id)
                    localStorage.setItem('score',data.id)
                })

        }

    },[])

    const handleReset = () => {
        localStorage.removeItem('score')
        setScore(0)
    }

    return (
        <div>
            <p>Games won: {score}</p>
            <button onClick={handleReset}>(reset)</button>
        </div>
    )
}

export default Dashboard

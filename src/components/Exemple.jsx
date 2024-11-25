import axios from "axios";
import React, { useEffect, useState } from "react";

const Exemple = () => {
    const [datas , setDatas] = useState([])

    useEffect (() => {
        getData()
    }, [])

    const getData = () => {
            axios.get('http://localhost:5000/api/students')
            .then(res  => setDatas(res.data))
            .catch(err  => console.log(err) )
            
    }

    return (
        <div>
                <select name="" id="">
                    { datas.map((eleves , i)  => ( 
                    <option key={i} value={eleves.Matricule}>{eleves.Matricule}</option>
                    ))}
                </select>

        </div>
    )
}

export default Exemple
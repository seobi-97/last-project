import React ,{useState} from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getDatabase, ref, set } from "firebase/database";

function AddPage() {
  const { register, formState: {errors}, handleSubmit } = useForm();
  const [errorFromSubmit, setErrorFromSubmit]=useState("");
  const [loading, setLoading] =useState(false);

  const onSubmit=async(data)=>{
    try{
      setLoading(true)

      setLoading(false)
    }catch(error){
      setErrorFromSubmit(error.message)
      setLoading(false)
      setTimeout(()=>{
        setErrorFromSubmit("")
      },5000);
    }
  }
  return (
    <div className="addpage">
      <form onSubmit={handleSubmit(onSubmit)}>
        <table border="1">
          <tbody>
            <tr align="center">
              <td width="50">No.</td>
              <td width="50">Time</td>
              <td width="50">Place</td>
              <td width="50">Distance</td>
              <td width="50">People</td>
            </tr>          
          </tbody>
        </table>
        <input name="no" {...register("no",{required:true})}/>
        {errors.name && errors.name.type === "required"
                  && <p>This name field is required</p>}

        <input name="Time" {...register("Time",{required:true})}/>
        {errors.name && errors.name.type === "required"
                  && <p>This name field is required</p>}

        <input name="Place" {...register("Place",{required:true})}/>
        {errors.name && errors.name.type === "required"
                  && <p>This name field is required</p>}

        <input name="Distance" {...register("Distance",{required:true})}/>
        {errors.name && errors.name.type === "required"
                  && <p>This name field is required</p>}

        <input name="People" {...register("People",{required:true})}/>
        {errors.name && errors.name.type === "required"
                  && <p>This name field is required</p>}
      <Link to="/">
        <input type="submit" disabled={loading}>생성하기</input>
      </Link>
      </form>
    </div>
  )
}

export default AddPage;

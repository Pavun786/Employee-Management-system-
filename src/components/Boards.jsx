

function Boards(){
 
    const boards = localStorage.getItem("boards")
    const datas = boards ? JSON.parse(boards) : []
     console.log(datas)
    return(
        <div>
        {/* {boards?.map((ele)=>{
            <div>
              <h5>{ele}</h5>  
             </div>   
        })} */}
        </div>
    )
}

export default Boards;
import { Chain } from "./client/zeus";

const chain = Chain("http://localhost:4000")

async function send(){
    try{
        const response = await chain("query")({
            getAllUsers:{
                email:true
            }
        }) 
        console.log(response);
        const mutatedResponse = await chain("mutation")({
            createUser:[
                {
                    input:{
                        name:"alpha",
                        email:"name",
                    }
                },
                {
                    id:true
                }
            ]
        })
        console.log(mutatedResponse);
        
    }
    catch(err){
        console.log(err);
    }
}

send()
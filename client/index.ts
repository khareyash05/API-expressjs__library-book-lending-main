import { Chain } from "./client/zeus";

const chain = Chain("http://localhost:4000/graphql")

async function send(){
    try{
        const response = await chain("query")({
            getUser:[
                {
                    id:"1"
                },
                {
                    email:true,
                    firstName:true
                }
            ]
        })
        console.log(response);        
    }
    catch(err){
        console.log(err);
    }
}
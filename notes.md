//error exceptions 20:00

coerce by5aleni lw m7dda en el fields string bs galy number f input coercion by7walo automatic l string => syntax z.coerce.string()

to validate on input => schema.body.safeParse()=>{error , success}
if i want to inherit a schema (extend)=> use safe extend

compare password and confirm password=>use .refine((data)=>{return data.password === data.confirmPassword},{error:"password mismatch with confirm password !})

lw h3ml refine 3la aktr mn 7aga el refine msh hatf3 f sa3tha ast5dm =>> superRefine((data,ctx)=>{
if(data.){
ctx.addIsue({
path:[""],
message:"",
code:"custom"
})
}
})

#TODO:signup
#TODO:login
#TODO:jwt

https://chatgpt.com/share/69e4063e-3ff4-83ea-8dc3-5e7fd11ac60d

//new stuff i have learned => storing refresh tokens into client cookies and read it ==> using cookie parser


  "data": {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTNhYTY5MzY1NmY3ZmUwZDk2NTg3NyIsImVtYWlsIjoibWFyeW9td3JheW9tMjJAZ21haWwuY29tIiwic2Vzc2lvbklkIjoiMTIzZjllZjktYThlMS00YjI0LWI3ZTQtNDlkZWEyZmQ4YmFkIiwiaWF0IjoxNzc2Njg1NTMxfQ.FDySbzHLEBzdKe1M5GUR-IhcdbXxN-ElXlloBB8Nzx0",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTNhYTY5MzY1NmY3ZmUwZDk2NTg3NyIsImVtYWlsIjoibWFyeW9td3JheW9tMjJAZ21haWwuY29tIiwic2Vzc2lvbklkIjoiMTIzZjllZjktYThlMS00YjI0LWI3ZTQtNDlkZWEyZmQ4YmFkIiwiaWF0IjoxNzc2Njg1NTMxfQ.QADavQNBKrpn2fdbVFnMxhrn07zAjeikDwAr0v5y9CA"
        }

        "data": {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTNhYTY5MzY1NmY3ZmUwZDk2NTg3NyIsImVtYWlsIjoibWFyeW9td3JheW9tMjJAZ21haWwuY29tIiwic2Vzc2lvbklkIjoiMjBmNjY1NjItYTUyOS00YmM2LWJmOTUtYjlmNTBjMGZhZWVmIiwiaWF0IjoxNzc2Njg1NTgwfQ.aO7Htf7K7vW9Q7jEAlytY47u6wG1OOv-bHpLem5LhkM",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTNhYTY5MzY1NmY3ZmUwZDk2NTg3NyIsImVtYWlsIjoibWFyeW9td3JheW9tMjJAZ21haWwuY29tIiwic2Vzc2lvbklkIjoiMjBmNjY1NjItYTUyOS00YmM2LWJmOTUtYjlmNTBjMGZhZWVmIiwiaWF0IjoxNzc2Njg1NTgwfQ.Yop6FKbqavlKVhc6JPoISYeDIsIzB4-RX3n-Hsq1ui0"
        }
    }
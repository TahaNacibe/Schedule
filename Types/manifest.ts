interface Manifest {
        owner_id:string,    
        name: string;
        version: string;
        description: string;
        main: string;
        icon: string;
        author: string;
        license: string;
        allowList: ExtAllowList[]
}
    

interface ExtAllowList {
    id: string,
    permission: "READ" | "WRITE" | "READ-WRITE"
}
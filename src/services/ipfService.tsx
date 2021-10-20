import {create} from 'ipfs-http-client';

class ipfsService{
    host = 'ipfs.infura.io'
    port = 5001
    ipfsClient: any;

    constructor(){
        this.ipfsClient = create({host: this.host, port: this.port, protocol: 'https'})
    }

    async addToIpfs(fileToUpload:any, thenCallback: Function){
        const result = [];
        this.ipfsClient.add(fileToUpload).then((response: any) => {
            result.push(response);
            thenCallback(response)
        })
    }
}

export default ipfsService
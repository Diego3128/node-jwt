export class UUID{

    static get randomId(){
        return crypto.randomUUID()
    }
}
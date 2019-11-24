import RibClient from '../../Rib-Client/src/RibClient';

let myRibClient2: RibClient;

describe('SERVER 2', () => {
    myRibClient2 = new RibClient("http://localhost:6000/", false);
    myRibClient2.onConnect(() => {
        //@ts-ignore
        myRibClient2.postMessage('Hello from client 2');
    });

    test('Expose Post Function', async (done) => {
        myRibClient2.exposeFunction((msg: string) => {
            expect(msg).toBe('Hello from client 1');
            done();
        }, undefined, 'postMessage');
    }, 20000);

    test('Simple Server Function', async () => {
        //@ts-ignore
        let val = await myRibClient2.add(1, 4);
        expect(val).toBe(5);
    });
});
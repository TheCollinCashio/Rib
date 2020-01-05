import RibClient from '../../Rib-Client/src/RibClient';

let myRibClient2: RibClient<{setName: (name: string) => Promise<void>, getNames: () => Promise<string[]>, add: (x: number, y: number) => Promise<number>, postMessage: (string) => Promise<void>}>;

describe('SERVER 2', () => {
    myRibClient2 = new RibClient("http://localhost:6000/", false);
    myRibClient2.onConnect(() => {
        //@ts-ignore
        myRibClient2.serverFunctions.postMessage('Hello from client 2');
    });

    test('Expose Post Function', async (done) => {
        myRibClient2.exposeFunction((msg: string) => {
            expect(msg).toBe('Hello from client 1');
            done();
        }, undefined, 'postMessage');
    }, 20000);

    test('Set Client Name', async () => {
        //@ts-ignore
        await myRibClient2.serverFunctions.setName('David');
    })

    test('POF Test', (done) => {
        setTimeout(async () => {
            //@ts-ignore
            let names = await myRibClient2.serverFunctions.getNames();
            expect(names).toContain('Collin');
            done();
        }, 400)
    })

    test('Simple Server Function', async () => {
        //@ts-ignore
        let val = await myRibClient2.serverFunctions.add(1, 4);
        expect(val).toBe(5);
    });
});
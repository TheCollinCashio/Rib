import RibClient from '../../Rib-Client/src/RibClient';

let myRibClient1: RibClient<{setName: (name: string) => Promise<void>, getNames: () => Promise<string[]>, add: (x: number, y: number) => Promise<number>, postMessage: (string) => Promise<void>}>;

describe('SERVER 1', () => {
  myRibClient1 = new RibClient("http://localhost:5000/", false);
  myRibClient1.onConnect(() => {
    //@ts-ignore
    myRibClient1.serverFunctions.postMessage('Hello from client 1');
  });

  test('Expose Post Function', async (done) => {
    myRibClient1.exposeFunction((msg: string) => {
      expect(msg).toBe('Hello from client 2');
      done();
    }, undefined, 'postMessage');
  }, 20000);

  test('Set Client Name', async () => {
    //@ts-ignore
    await myRibClient1.serverFunctions.setName('Collin');
  })

  test('POF Test', (done) => {
    setTimeout(async () => {
      //@ts-ignore
      let names = await myRibClient1.serverFunctions.getNames();
      expect(names).toContain('David')
      done();
    }, 400)
  })

  test('Simple Server Function', async () => {
    //@ts-ignore
    let val = await myRibClient1.serverFunctions.add(1, 4);
    expect(val).toBe(5);
  });

  test('Refresh Browser', (done) => {
    myRibClient1.close();
    myRibClient1 = new RibClient("http://localhost:5000/", false);
    myRibClient1.onConnect(async () => {
      //@ts-ignore
      let name = await myRibClient1.serverFunctions.getName();
      expect(name).toBe('Collin');
      done();
    });
  });
});

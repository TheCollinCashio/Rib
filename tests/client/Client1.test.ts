import RibClient from '../../Rib-Client/src/RibClient';

let myRibClient1: RibClient

describe('SERVER 1', () => {
  myRibClient1 = new RibClient("http://localhost:5000/", false);
  myRibClient1.onConnect(() => {
      //@ts-ignore
      myRibClient1.postMessage('Hello from client 1');
  });

  test('Expose Post Function', async (done) => {
    myRibClient1.exposeFunction((msg: string) => {
      expect(msg).toBe('Hello from client 2');
      done();
    }, undefined, 'postMessage');
  }, 20000);

  test('Simple Server Function', async () => {
    //@ts-ignore
    let val = await myRibClient1.add(1, 4);
    expect(val).toBe(5);
  });
});

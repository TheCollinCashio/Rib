import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import RibClient from '../Rib-Client/src/RibClient';

describe('SERVER 1', () => {
  let myRib : RibClient

  test('Did Connect', (done) => {
    myRib = new RibClient("http://localhost:5000/", true);
    myRib.onConnect(() => {
      done();
    });
  });

  // test('Expose Post Function', (done) => {
  //   myRib.exposeFunction((msg: string) => {
  //     expect(msg).toBe('Hello from server 2');
  //     done();
  //   }, undefined, 'postMessage');

  //   //@ts-ignore
  //   myRib.postMessage('Hello from server 1');
  // });

  test('Simple Server Function', async () => {
    //@ts-ignore
    let val = await myRib.add(1, 4);
    expect(val).toBe(5);
  });

  test('Does Mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('SERVER 2', () => {
  let myRib : RibClient

  test('Did Connect', (done) => {
    myRib = new RibClient("http://localhost:6000/", false);
    myRib.onConnect(() => {
      done();
    });
  });

  // test('Expose Post Function', (done) => {
  //   myRib.exposeFunction((msg: string) => {
  //     expect(msg).toBe('Hello from server 1');
  //     done();
  //   }, undefined, 'postMessage');

  //   //@ts-ignore
  //   myRib.postMessage('Hello from server 2');
  // });

  test('Simple Server Function', async () => {
    //@ts-ignore
    let val = await myRib.add(1, 4);
    expect(val).toBe(5);
  });

  test('Does Mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
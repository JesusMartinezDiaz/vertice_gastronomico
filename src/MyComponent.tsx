import { useState } from 'react';

export default function MyComponent() {
  const [clicked, setClicked] = useState(false);

  return (
    <div>
      <p>Hola Mundo</p>
      <button onClick={() => setClicked(true)}>Click me</button>
      {clicked && <p>Clicked</p>}
    </div>
  );
}

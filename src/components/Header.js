import React from 'react';
import Link from 'next/link';

const Header = () => (
  <header class = "flex justify-center bg-slate-300">
    <nav>
      <ul class = "flex">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/about">About</Link></li>
      </ul>
    </nav>
  </header>
);

export default Header;

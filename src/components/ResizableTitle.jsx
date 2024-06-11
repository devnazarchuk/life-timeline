'use client';

import {useRef} from 'react'

import {useResizableEffect} from "@/shared/hooks";

import type {FC} from 'react'

type ResizableTitle = {
  text?: string
  defaultFontSize?: number
  minFontSize?: number
  maxFontSize?: number
}

const ResizableTitle: FC<ResizableTitle> = (
  {
    text,
    defaultFontSize = 16,
    minFontSize,
    maxFontSize
  }) => {

  const ref = useRef<any>(null)

  const textLength = text?.length ? text.length : 1

  console.log('render')

  const resizeCallback = (entry: ResizeObserverEntry) => {
    let fontSize = minFontSize ?? 0

    if (ref.current && 'style' in ref.current) {
      fontSize = (entry.contentBoxSize.at(0)?.inlineSize ?? 0)
      fontSize /= defaultFontSize / 10
      fontSize /= textLength / 2.6
      if (minFontSize && maxFontSize) {
        fontSize = Math.min(Math.max(fontSize, minFontSize), maxFontSize)
      }

      ref.current.style.fontSize = `${fontSize}px`
    }
  }

  useResizableEffect(resizeCallback, ref)


  return (
    <>
      <h1
        ref={ref}
        className="font-bold ml-2 whitespace-nowrap text-ellipsis overflow-hidden"
      >
        {text}
      </h1>
    </>
  )
}

export default ResizableTitle
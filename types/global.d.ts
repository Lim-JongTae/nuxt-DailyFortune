export {}

declare module 'omggif' {
  export class GifWriter {
    constructor(buf: Uint8Array, width: number, height: number, options?: { loop?: number })
    addFrame(
      x: number,
      y: number,
      width: number,
      height: number,
      indexedPixels: Uint8Array,
      options?: { palette?: Uint8Array | number[]; delay?: number }
    ): number
    end(): number
  }
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.webp' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}

declare global {
  interface FilePickerAcceptType {
    description?: string
    accept: Record<string, string | string[]>
  }

  interface SaveFilePickerOptions {
    suggestedName?: string
    types?: FilePickerAcceptType[]
  }

  interface FileSystemFileHandle {
    createWritable(): Promise<FileSystemWritableFileStream>
  }

  interface FileSystemWritableFileStream {
    write(data: BufferSource | Blob | string): Promise<void>
    close(): Promise<void>
  }

  interface Window {
    showSaveFilePicker?: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>
  }
}

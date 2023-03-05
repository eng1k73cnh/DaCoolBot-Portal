declare global {
  interface FilterState {
    channel: string;
    message: string;
    ping: {
      enabled: boolean;
      content: string;
    };
    files: File[];
    fileSize: number;
  }
}

export {};

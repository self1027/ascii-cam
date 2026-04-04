export class CameraService {
  video = document.createElement('video');
  stream: MediaStream | null = null;

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 } 
      });
      this.video.srcObject = this.stream;
      this.video.setAttribute("playsinline", "true");
      await this.video.play();
      return true;
    } catch { return false; }
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    this.video.pause();
  }

  get isReady() {
    return !this.video.paused && this.video.readyState >= 2;
  }
}
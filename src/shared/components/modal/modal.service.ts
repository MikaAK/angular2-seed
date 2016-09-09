import {Injectable} from '@angular/core'

@Injectable()
export class ModalService {
  public isOpen: boolean = false

  public toggle(): void {
    if (this.isOpen)
      this.close()
    else
      this.open()
  }

  public close(): void {
    this.isOpen = false
  }

  public open(): void {
    this.isOpen = true
  }
}

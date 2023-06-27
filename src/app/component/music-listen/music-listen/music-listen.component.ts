import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, interval, takeUntil } from 'rxjs';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-music-listen',
  templateUrl: './music-listen.component.html',
  styleUrls: ['./music-listen.component.scss'],
})
export class MusicListenComponent implements OnInit, OnDestroy {
  fileTitle: string = 'latinoamerica.mp3';
  progress: number = 0;
  isPlaying: boolean = false;
  audioPlayer: HTMLAudioElement;
  interval: any;

  updatedPayPerViewValue: number = 0;
  companyBudgetValue: number = 0;
  advViews: number = 0;
  marketingBudgetValue: number = 0;
  payPerViewValue: number = 0;
  musicianAccountValue: number = 0;
  payPerListenValue: number = 0;
  updatedPayPerListenValue: number = 0;

  constructor(
    private _router: Router,
    private contractService: ContractService
  ) {
    this.loadAllData();
    this.audioPlayer = new Audio();
    this.audioPlayer.src = 'assets/latinoamerica.mp3';
  }
  ngOnDestroy() {
  }
  ngOnInit(): void {
    this.audioPlayer.addEventListener('loadedmetadata', () => {
      const duration = this.audioPlayer.duration;
      this.interval = setInterval(() => {
        if (this.isPlaying && this.progress < 100) {
          const currentTime = this.audioPlayer.currentTime;
          this.progress = (currentTime / duration) * 100;
        }
      }, 1000);
    });
  }


  cueing: boolean = false;
  queuedCalls: Promise<any>[] = [];
  isExecuting: boolean = false;

  playMusic() {
    // Logic to play the music
    this.isPlaying = true;
    this.audioPlayer.play();

    this.cueing = true;
    setInterval(() => {
      if (this.cueing) {
        this.enqueueCall();
      }
    }, 5000);
  }

  enqueueCall(): void {
    this.queuedCalls.push(this.contractService.sendMusicMoneyToAuthor());
    this.queuedCalls.push(this.loadAllData());
    if (!this.isExecuting) {
      this.executeCue();
    }
  }

  pauseMusic(): void {
    this.audioPlayer.pause();
    this.isPlaying = false
    this.cueing = false;
  }

  executeCue(): void {
    if (!this.isExecuting && this.queuedCalls.length > 0) {
      this.isExecuting = true;
      const call = this.queuedCalls.shift();
      call
        ?.then(() => {
          this.isExecuting = false;
          if (this.cueing || this.queuedCalls.length > 0) {
            this.executeCue();
          }
        })
        .catch((error) => {
          console.error(error);
          this.isExecuting = false;
        });
    }
  }

  navigate(path?: string) {
    this._router.navigate(['home']);
  }

  async getPayPerViewValue() {
    this.updatedPayPerViewValue =
      await this.contractService.getPayPerViewValue();
  }

  async getCompanyBudget() {
    this.companyBudgetValue = await this.contractService.getCompanyBudget();
  }

  async getMktBudget() {
    this.marketingBudgetValue = await this.contractService.getMktBudget();
  }

  async getViews() {
    this.advViews = await this.contractService.getViews();
  }

  async getMusicianValue() {
    this.musicianAccountValue = await this.contractService.getMusicianValue();
  }

  async getPayPerListenValue() {
    this.updatedPayPerListenValue =
      await this.contractService.getPayPerListenValue();
  }

  async loadAllData() {
    await this.getPayPerViewValue();
    await this.getPayPerListenValue();
    await this.getCompanyBudget();
    await this.getMktBudget();
    await this.getMusicianValue();
    await this.getViews();
  }
}

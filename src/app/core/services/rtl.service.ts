import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * RTL Service
 * 
 * Provides utilities and state management for RTL layout and Persian language support
 */
@Injectable({
  providedIn: 'root'
})
export class RtlService {
  private readonly _isRtl = new BehaviorSubject<boolean>(true);
  
  /**
   * Observable for RTL state changes
   */
  public readonly isRtl$: Observable<boolean> = this._isRtl.asObservable();
  
  constructor() {
    this.initializeRtl();
  }
  
  /**
   * Initialize RTL settings
   */
  private initializeRtl(): void {
    // Set document direction
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'fa';
    
    // Add RTL class to body
    document.body.classList.add('rtl-layout');
  }
  
  /**
   * Get current RTL state
   */
  get isRtl(): boolean {
    return this._isRtl.value;
  }
  
  /**
   * Set RTL state (for future LTR support if needed)
   */
  setRtl(isRtl: boolean): void {
    this._isRtl.next(isRtl);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    
    if (isRtl) {
      document.body.classList.add('rtl-layout');
      document.body.classList.remove('ltr-layout');
    } else {
      document.body.classList.add('ltr-layout');
      document.body.classList.remove('rtl-layout');
    }
  }
  
  /**
   * Get RTL-aware positioning class
   */
  getRtlClass(baseClass: string): string {
    return this.isRtl ? `${baseClass}-rtl` : `${baseClass}-ltr`;
  }
  
  /**
   * Get RTL-aware margin classes
   */
  getMarginClass(side: 'left' | 'right', size: string = '4'): string {
    if (this.isRtl) {
      return side === 'left' ? `mr-${size}` : `ml-${size}`;
    }
    return side === 'left' ? `ml-${size}` : `mr-${size}`;
  }
  
  /**
   * Get RTL-aware padding classes
   */
  getPaddingClass(side: 'left' | 'right', size: string = '4'): string {
    if (this.isRtl) {
      return side === 'left' ? `pr-${size}` : `pl-${size}`;
    }
    return side === 'left' ? `pl-${size}` : `pr-${size}`;
  }
  
  /**
   * Get RTL-aware text alignment
   */
  getTextAlignClass(align: 'left' | 'right' | 'center'): string {
    if (align === 'center') return 'text-center';
    
    if (this.isRtl) {
      return align === 'left' ? 'text-right' : 'text-left';
    }
    return align === 'left' ? 'text-left' : 'text-right';
  }
  
  /**
   * Get RTL-aware flex direction
   */
  getFlexDirectionClass(reverse: boolean = false): string {
    if (this.isRtl) {
      return reverse ? 'flex-row' : 'flex-row-reverse';
    }
    return reverse ? 'flex-row-reverse' : 'flex-row';
  }
  
  /**
   * Get RTL-aware justify content classes
   */
  getJustifyClass(position: 'start' | 'end' | 'center' | 'between' | 'around'): string {
    if (position === 'center' || position === 'between' || position === 'around') {
      return `justify-${position}`;
    }
    
    if (this.isRtl) {
      return position === 'start' ? 'justify-end' : 'justify-start';
    }
    return `justify-${position}`;
  }
}
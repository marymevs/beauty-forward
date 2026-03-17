import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contribution-panel',
  imports: [FormsModule],
  templateUrl: './contribution-panel.component.html',
  styleUrl: './contribution-panel.component.scss'
})
export class ContributionPanelComponent {
  @Input() heading = 'Help cover the cost of pickup';
  @Input() body =
    'Your contribution helps us move more beauty products to people who need them.';
  @Input() suggestedAmount = 15;
  @Input() amount?: number;
  @Input() buttonLabel = 'Contribute with Givebutter';
  @Input() pending = false;

  @Output() amountChange = new EventEmitter<number | undefined>();
  @Output() contribute = new EventEmitter<number | undefined>();

  protected amountInput = '';

  ngOnInit(): void {
    this.amountInput = this.amount ? this.amount.toString() : '';
  }

  protected emitAmount(): void {
    this.amountChange.emit(this.parseAmount(this.amountInput));
  }

  protected triggerContribution(): void {
    this.contribute.emit(this.parseAmount(this.amountInput));
  }

  private parseAmount(raw: string): number | undefined {
    const numeric = Number(raw);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      return undefined;
    }

    return Math.round(numeric * 100) / 100;
  }
}

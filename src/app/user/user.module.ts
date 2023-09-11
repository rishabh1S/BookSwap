import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { TabComponent } from './tab/tab.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AuthModalComponent, TabsContainerComponent, TabComponent],
  imports: [CommonModule, FormsModule],
  exports: [AuthModalComponent],
})
export class UserModule {}

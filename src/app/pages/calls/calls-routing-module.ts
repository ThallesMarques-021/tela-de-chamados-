import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Calls } from './calls';
import { CallListComponent } from './lista-chamado/call-list';

const routes: Routes = [{ path: '', component: CallListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallsRoutingModule {}

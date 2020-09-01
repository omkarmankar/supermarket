import { Component, OnInit } from '@angular/core';
import {CustomService} from '../services/custom.service';
import { SupercategorymenuService } from '../services/supercategorymenu.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  superCategoryArray=[];
  error:string="";
  constructor(private customService:CustomService,private superCategoryService:SupercategorymenuService) {
   }

  ngOnInit() { 
    this.getSuperCategories();
    this.customService.load();
  }

  getSuperCategories(){
    this.superCategoryService.getSuperCategories().subscribe(response => {
    this.superCategoryArray=[...response.data];
  },
    error => {
    this.error=error;
  });
  }
}


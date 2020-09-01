import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SupercategorymenuService } from '../services/supercategorymenu.service';
import {SharedService} from '../services/shared.service';
import {Router} from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-categorymenu',
  templateUrl: './categorymenu.component.html',
  styleUrls: ['./categorymenu.component.css']
})
export class CategorymenuComponent implements OnInit {

  superCategoryArray=[];
  superCategoryProducts=[];
  superCategoryProductsImages=[];
  superCategoryFilteredProductsImages=[];
  subCategories=[];
  Categories=[];
  error:string="";
  
  constructor(private sharedService:SharedService,private superCategoryService:SupercategorymenuService,private router:Router) { 
  }

  ngOnInit() {  
    $('.dropdown-content').hide();
    this.getSuperCategories();
  }  


  getSuperCategories(){
  this.superCategoryService.getSuperCategories().subscribe(response => {
      this.superCategoryArray=[...response.data];
      console.log(this.superCategoryArray);
      console.log(response.message);
  },
    error => {
    this.error=error;
  });
  }
  
  getProductBySuperCategoryId(event){
    this.sharedService.superCategoryEventTrack.next(event); // event using service 
  }

 /*  getProductsImagesById(){
    let productImages=[],thumbnailImages=[];
    this.superCategoryFilteredProductsImages=[];
    this.superCategoryProducts.forEach((element1) => {
      this.superCategoryProductsImages.forEach((element2) => {
          let idArray=element2.p_id_text.split('/');
          if(idArray.includes(""+element1.id)){
            productImages.push(element2.p_images);
            thumbnailImages.push(element2.thumbnail_images);
          }
      });
      let obj={
        id:element1.id,
        productImages:productImages,
        thumbnailImages:thumbnailImages
      }
      this.superCategoryFilteredProductsImages.push(obj);
      productImages=[];
      thumbnailImages=[];
    });
  }
 */
  showMegaMenu(superCategoryId){
   this.sharedService.setSuperCategoryId(superCategoryId);
    this.Categories=[];
    this.sharedService.getSubCategoriesBySuperCategoryId(superCategoryId).subscribe(response => {
      this.subCategories=[...response.data];
      console.log(this.subCategories);
  },
    error => {
    this.error=error;
  });
    // $('.dropdown-content').show();
  }
  hideMegaMenu(){
    $('.dropdown-content').hide();
  }

  getCategoriesOnSubcategoriesHover(subCategoryId){
    this.sharedService.getCategoriesBySubCategoryId(subCategoryId).subscribe(response => {
      this.Categories=[...response.data];
      console.log(this.Categories);
  },
    error => {
    this.error=error;
  });
  }
}

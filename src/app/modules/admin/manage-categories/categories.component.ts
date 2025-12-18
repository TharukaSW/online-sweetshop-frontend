import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MasterService } from '../../../core/services/master-service';
import { Category } from '../../../shared/model/category.model';


@Component({
  selector: 'app-categories',
  imports: [DatePipe, ReactiveFormsModule, CommonModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class ManageCategoriesComponent implements OnInit, OnDestroy {

  categoryForm!: FormGroup;
  formBuilder = inject(FormBuilder);
  service = inject(MasterService);

  
  categories!: Observable<Category[]>;

  subscriptions: Subscription[] = [];

  constructor() {
    this.loadCategories();
  }
  

  loadCategories() {
    this.categories = this.service.getAllCategories();
  }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    })
  }

  onAddCategory() {
    if (this.categoryForm.valid) {
      const sub = this.service.saveCategory(this.categoryForm.value).subscribe({
        next: () => {
          this.categoryForm.reset();
          this.loadCategories();
        },
        error: (err) => {
          console.error('Error adding category:', err);
        }
      });
      this.subscriptions.push(sub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}

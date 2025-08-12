import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { PCService, RoomLocationService, AlertService } from '@app/_services';
import { PC } from '../_models/pc';

@Component({ templateUrl: 'pc-add-edit.component.html' })
export class PCAddEditComponent implements OnInit {
    form: FormGroup;
    id: number;
    isAddMode: boolean;
    isViewMode: boolean;
    loading = false;
    submitted = false;
    roomLocations: any[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private pcService: PCService,
        private roomLocationService: RoomLocationService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        this.isViewMode = this.router.url.includes('/view/');

        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            serialNumber: [''],
            roomLocationId: ['', Validators.required],
            status: ['Active', Validators.required],
            assignedTo: [''],
            notes: ['']
        });

        this.loadRoomLocations();

        if (!this.isAddMode) {
            this.loadPC();
        }

        // Disable form in view mode
        if (this.isViewMode) {
            this.form.disable();
        }
    }

    loadRoomLocations() {
        this.roomLocationService.getAll()
            .pipe(first())
            .subscribe(locations => {
                this.roomLocations = locations;
            });
    }

    loadPC() {
        this.pcService.getById(this.id)
            .pipe(first())
            .subscribe(pc => {
                this.form.patchValue(pc);
            });
    }

    get f() { return this.form.controls; }

    canSubmit(): boolean {
        return this.form.valid;
    }

    goToStock() {
        this.router.navigate(['/stocks']);
    }

    onSubmit() {
        this.submitted = true;
        console.log('PC Add Form Submitted:', this.form.value);
        console.log('Form Valid:', this.form.valid);
        console.log('Can Submit:', this.canSubmit());

        if (!this.canSubmit()) {
            console.log('Form validation failed');
            return;
        }

        this.loading = true;
        const pcData = this.form.value;
        console.log('PC Data to send:', pcData);

        if (this.isAddMode) {
            this.createPC(pcData);
        } else {
            this.updatePC(pcData);
        }
    }

    private createPC(pcData: any) {
        console.log('Creating PC with data:', pcData);
        this.pcService.create(pcData)
            .pipe(first())
            .subscribe({
                next: (pc) => {
                    console.log('PC created successfully:', pc);
                    this.alertService.success('PC created successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    console.error('Error creating PC:', error);
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updatePC(pcData: any) {
        this.pcService.update(this.id, pcData)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('PC updated successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
} 
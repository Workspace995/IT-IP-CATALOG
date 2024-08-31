import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.css']
})
export class DetailPageComponent implements OnInit {
  patent: any;
  openedSections: Set<string> = new Set();

  constructor(private location: Location) {}

  ngOnInit(): void {
    // Ensure the patent data is retrieved from the navigation state
    this.patent = history.state.patent;
    console.log('Received patent data:', this.patent);
  }

  close(): void {
    this.location.back();
  }

  toggleSection(section: string): void {
    if (this.openedSections.has(section)) {
      this.openedSections.delete(section);
    } else {
      this.openedSections.add(section);
    }
  }

  isSectionOpen(section: string): boolean {
    return this.openedSections.has(section);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogService } from '../catalog.service';
import { ChatComponent } from '../chat/chat.component'; // Ensure the path to ChatComponent is correct

interface Patent {
  referenceNumber: any;
  serial: any;
  filingDate: any;
  subtype: any;
  summary: any;
  claim: any;
  inventors: any;
  title: string;
  fileNo: string;
  application: string;
  macro: string;
  category: string;
  country?: string;
  patentStatus?: string;
  subCategory?: string;
}

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatComponent],
  templateUrl: './catalog-page.component.html',
  styleUrls: ['./catalog-page.component.css']
})
export class CatalogPageComponent implements OnInit {
  patents: Patent[] = [];
  filteredPatents: Patent[] = [];
  displayedPatents: Patent[] = [];
  showFilterMenu: boolean = false;

  // Pagination settings
  itemsPerPage: number = 20; // Number of items to display per page
  currentPage: number = 1; // Current page number
  totalPages: number = 0; // Total number of pages

  // Filter options
  countryOptions: string[] = [];
  statusOptions: string[] = [];
  macroOptions: string[] = [];
  categoryOptions: string[] = [];
  subCategoryOptions: string[] = [];

  // Filters
  filters = {
    title: '',
    country: '',
    patentStatus: '',
    macro: '',
    category: '',
    subCategory: ''

  };
  searchQuery: any;

  constructor(private catalogService: CatalogService, private router: Router) {}

  ngOnInit(): void {
    this.loadFilterOptions();
    this.fetchAllCatalogData();
  }

  fetchAllCatalogData(): void {
    this.catalogService.getPatents().subscribe(response => {
      const hits = response.hits.hits;

      this.patents = hits.map((hit: any) => ({
        title: hit._source.TITLE,
        fileNo: hit._source['FILE NO.'],
        application: hit._source.APPLICATION === "null" || hit._source.APPLICATION === undefined ? 'N/A' : hit._source.APPLICATION,
        macro: hit._source.MACRO,
        category: hit._source['CAT 1'],
        country: hit._source['COUNTRY NAME'],
        patentStatus: hit._source.STATUS,
        subCategory: hit._source['CAT2'],
        inventors:hit._source.INVENTORS,
        referenceNumber:hit._source['CLIENT REF. NO.'],
        serial:hit._source['SERIAL #'],
        filingDate:hit._source['indexed_date'],
        subtype:hit._source['SUB TYPE DESCRIPTION'],
        summary:hit._source['BRIEF SUMMARY'],
        claim:hit._source['EXAMPLE CLAIM']
      }));

      this.filteredPatents = [...this.patents]; // Initialize filtered data
      this.currentPage = 1; // Reset to first page
      this.updateDisplayedPatents(); // Initialize displayed patents
    }, error => {
      console.error('Error fetching data from API', error);
    });
  }

  loadFilterOptions(): void {
    this.catalogService.getCountries().subscribe(response => {
      this.countryOptions = response.aggregations.countries.buckets.map((bucket: any) => bucket.key);
    }, error => {
      console.error('Error fetching country options', error);
    });

    this.catalogService.getStatuses().subscribe(response => {
      this.statusOptions = response.aggregations.statuses.buckets.map((bucket: any) => bucket.key);
    }, error => {
      console.error('Error fetching status options', error);
    });

    this.catalogService.getMacros().subscribe(response => {
      this.macroOptions = response.aggregations.macros.buckets.map((bucket: any) => bucket.key);
    }, error => {
      console.error('Error fetching macro options', error);
    });

    this.catalogService.getCategories().subscribe(response => {
      this.categoryOptions = response.aggregations.categories.buckets.map((bucket: any) => bucket.key);
    }, error => {
      console.error('Error fetching category options', error);
    });

    this.catalogService.getSubCategories().subscribe(response => {
      this.subCategoryOptions = response.aggregations.subcategories.buckets.map((bucket: any) => bucket.key);
    }, error => {
      console.error('Error fetching subcategory options', error);
    });
  }

  toggleFilterMenu(): void {
    this.showFilterMenu = !this.showFilterMenu;
  }

     applyFilters(): void {
     this.filteredPatents = this.patents.filter(patent => {
       return (!this.filters.title || patent.title.toLowerCase().includes(this.filters.title.toLowerCase())) &&
              (!this.filters.country || patent.country === this.filters.country) &&
              (!this.filters.patentStatus || patent.patentStatus === this.filters.patentStatus) &&
              (!this.filters.macro || patent.macro === this.filters.macro) &&
              (!this.filters.category || patent.category === this.filters.category) &&
              (!this.filters.subCategory || patent.subCategory === this.filters.subCategory);
     });

     this.currentPage = 1; // Reset to first page after filtering
     this.updateDisplayedPatents(); // Update displayed patents based on filters
   }


  clearFilters(): void {
    this.filters = { title: '', country: '', patentStatus: '', macro: '', category: '', subCategory: '' };
    this.filteredPatents = [...this.patents];
    this.currentPage = 1; // Reset to first page
    this.updateDisplayedPatents(); // Update displayed patents after clearing filters
  }

  updateDisplayedPatents(): void {
    this.totalPages = Math.ceil(this.filteredPatents.length / this.itemsPerPage); // Calculate total pages
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedPatents = this.filteredPatents.slice(startIndex, endIndex); // Slice patents for the current page
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedPatents();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedPatents();
    }
  }

  viewDetails(patent: Patent): void {
    console.log('Navigating to details with patent:', patent);
    this.router.navigate(['/details'], { state: { patent: patent } });
  }

  hasFilters(): boolean {
    return Boolean(this.filters.country || this.filters.patentStatus || this.filters.macro || this.filters.category || this.filters.subCategory);
  }

  clearSpecificFilter(filterType: 'country' | 'patentStatus' | 'macro' | 'category' | 'subCategory'): void {
    this.filters[filterType] = '';
    this.applyFilters();
  }
  navigateToHome(): void {
    this.router.navigate(['/']); // Programmatically navigate to the home page
  }
  performSearch(): void {
    const searchLower = this.searchQuery.toLowerCase();

    this.filteredPatents = this.patents.filter(patent => {
      return (
        (!searchLower ||
         patent.title.toLowerCase().includes(searchLower) ||
         patent.fileNo.toLowerCase().includes(searchLower) ||
         patent.application.toLowerCase().includes(searchLower) ||
         patent.macro.toLowerCase().includes(searchLower) ||
         patent.category.toLowerCase().includes(searchLower) ||
         (patent.country && patent.country.toLowerCase().includes(searchLower)) ||
         (patent.patentStatus && patent.patentStatus.toLowerCase().includes(searchLower)) ||
         (patent.subCategory && patent.subCategory.toLowerCase().includes(searchLower)) ||
         (patent.inventors && patent.inventors.toLowerCase().includes(searchLower)) ||
         (patent.referenceNumber && patent.referenceNumber.toLowerCase().includes(searchLower)) ||
         (patent.serial && patent.serial.toLowerCase().includes(searchLower)) ||
         (patent.filingDate && patent.filingDate.toLowerCase().includes(searchLower)) ||
         (patent.subtype && patent.subtype.toLowerCase().includes(searchLower)) ||
         (patent.summary && patent.summary.toLowerCase().includes(searchLower)) ||
         (patent.claim && patent.claim.toLowerCase().includes(searchLower))
        )
      );
    });

    this.currentPage = 1; // Reset to the first page after searching
    this.updateDisplayedPatents(); // Update displayed patents based on search
  }

}

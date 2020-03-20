import { Component, ViewChild, ChangeDetectorRef, ViewChildren, QueryList, ElementRef } from '@angular/core'
import { ModalService } from 'src/app/core/services/modal-service.service'
import { FileUploadFormsModel } from './model/forms'
import { faSearch, faFileAlt } from '@fortawesome/free-solid-svg-icons'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { PreviewModel } from './model/preview'
import { ComboBoxComponent } from 'src/app/core/components/input/combo-box/combo-box.component'
import { GridComponent } from 'src/app/core/components/grid/grid.component'
import { DatePickerComponent } from 'src/app/core/components/input/date-picker/date-picker.component'

interface Response {
  error?: string,
  errors?: any,
  root: {
    header: string[],
    data: any[]
  }
}

interface FormElement {
  id: string
  type: string
  description: string
  label: string
  readOnly: 0 | 1
  default: string | number
}

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent {

  selectedType: string
  selectedFile: File
  showPreviewGrid = false
  formElements: FormElement[] = []

  // icons
  faSearch = faSearch
  faFile = faFileAlt

  @ViewChild(ComboBoxComponent) combobox: ComboBoxComponent
  @ViewChild('previewGrid') previewGrid: GridComponent
  @ViewChildren('formElement') formElementsRef: QueryList<ElementRef | DatePickerComponent>

  constructor(
    private http: HttpClient,
    public modalService: ModalService,
    public formsModel: FileUploadFormsModel,
    public previewModel: PreviewModel,
    private cdRef: ChangeDetectorRef
  ) { }

  onFileInputChange(files: FileList): void {
    this.selectedFile = files.item(0)
    this.showPreviewGrid = false
  }

  onSelectionChange(type: { title: string, id: string }): void {
    this.selectedType = type.id
    this.showPreviewGrid = false
    this.formElements = []
    this.getFormElements(type.id)
  }

  getFormElements(id: string): void {
    let params = { formId: id }
    this.http.get<FormElement[]>(environment.apiUrl + '/fileUploader/getFormElements', { params }).subscribe(elements => {
      this.formElements = elements
    })
  }

  onPreviewClick(): void {
    var formData = new FormData()
    formData.append('field_file', this.selectedFile)
    formData.append('formId', this.selectedType)
    this.http.post<Response>(environment.apiUrl + '/fileUploader/preview', formData)
      .subscribe(res => {
        this.createPreviewGrid(res)
      })
  }

  createPreviewGrid(response: Response): void {
    let { data, header } = response.root

    if (response.error) this.modalService.showError(null, response.error)

    if (header) {
      this.previewModel.loadData(data)
      this.previewModel.fields = header.map(item => ({
        name: item,
        displayName: item,
        type: 'string'
      }))
      this.showPreviewGrid = true
    }

    this.cdRef.detectChanges() // we need this because the grid is inside an ngIf
    if (response.errors) {
      this.previewGrid.errors = response.errors
    } else {
      this.previewGrid.errors = {}
    }
  }

  onUploadClick(): void {
    let formData = new FormData()
    formData.append('field_form', this.selectedType)
    formData.append('field_file', this.selectedFile)
    this.formElementsRef.forEach(element => {
      if (element instanceof ElementRef) {
        if (element.nativeElement.id === 'p_filename') {
          formData.append('cfield_' + element.nativeElement.name, this.selectedFile.name)
        } else {
          formData.append('cfield_' + element.nativeElement.name, element.nativeElement.value)
        }
      } else if (element instanceof DatePickerComponent) {
        formData.append('cfield_' + element.name, element.value)
      }
    })

    this.http.post<Response>(environment.apiUrl + '/fileUploader/sendFormData', formData)
      .subscribe(res => {
        if (res.errors && res.root.header) this.createPreviewGrid(res)
      })
  }

  reset(): void {
    this.selectedFile = null
    this.selectedType = null
    this.showPreviewGrid = false
    this.formElements = []
    this.combobox.setValue('')
  }

}

import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core'
import { faBars, faChevronRight, faChevronDown, faFilePdf, faRedo, faFolder, faFile } from '@fortawesome/free-solid-svg-icons'
import { of as observableOf } from 'rxjs'
import { NestedTreeControl } from '@angular/cdk/tree'
import { RegulationService, RegulationNode, RegulationAttachment } from './service/regulation.service'
import * as _ from 'lodash'
import { ModalService } from 'src/app/core/services/modal-service.service'
import { Location } from '@angular/common'
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms'
import { ModalComponent } from 'src/app/core/components/modal/modal.component'
import { FormSubmit } from 'src/app/core/decorators/form-submit'
import { GroupsModel } from './model/groups'
import { CheckboxGroupComponent } from 'src/app/core/components/input/checkbox-group/checkbox-group.component'

@Component({
  selector: 'app-regulation',
  templateUrl: './regulation.component.html',
  styleUrls: ['./regulation.component.scss']
})
export class RegulationComponent implements OnInit {
  nestedTreeControl: NestedTreeControl<RegulationNode>
  nestedDataSource: RegulationNode[] = []
  clonedTree: RegulationNode[] = []

  // Icons
  faBars = faBars
  faChevronRight = faChevronRight
  faChevronDown = faChevronDown
  faFilePdf = faFilePdf
  faRedo = faRedo
  faFolder = faFolder
  faFile = faFile

  selected: RegulationNode
  attachments: RegulationAttachment[] = []
  selectedAttachment: RegulationAttachment

  menuItems = [
    { name: 'newFolder', text: 'Új mappa' },
    { name: 'editFolder', text: 'Mappa szerkesztése' },
    { name: 'newRegulation', text: 'Új szabályzat' },
    { name: 'editRegulation', text: 'Szabályzat szerkesztése' },
    { name: 'deleteAttachment', text: 'Melléklet törlése' }
  ]

  folderForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    description: new FormControl('')
  })

  regulationForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    document: new FormControl('', Validators.required),
    attachment: new FormControl(''),
    public: new FormControl(false)
  })

  document: File
  attachment: File
  newEntry: boolean

  @ViewChild('folderModal') folderModal: ModalComponent
  @ViewChild('groups') groups: CheckboxGroupComponent
  @ViewChildren('attachmentRef') attachmentsRef: QueryList<ElementRef<HTMLDivElement>>

  constructor(
    private service: RegulationService,
    public modalService: ModalService,
    private location: Location,
    public groupsModel: GroupsModel
  ) {
    this.nestedTreeControl = new NestedTreeControl<RegulationNode>(this.getChildren)
  }

  ngOnInit(): void {
    this.getData()
  }

  getData(redirect = true): void {
    this.service.getRegulations().subscribe(regulations => {
      this.nestedDataSource = regulations
      this.clonedTree = regulations
      let id = this.location.normalize(this.location.path()).split('/').pop()
      if (id !== 'regulation' && redirect) this.selectById(id)
    })
  }

  selectById(id: string): void {
    this.nestedDataSource.forEach(folder => {
      if (folder.children) folder.children.forEach(node => {
        if (node.ID.toString().replace('-', '') === id) {
          this.selected = node
          this.nestedTreeControl.expand(folder)
          this.getAttachments(node)
          return
        }
      })
    })
    if (!this.selected) this.modalService.showMessage('A(z) "' + id + '" id nem létezik!')
  }

  onRegulationClick(regulation: RegulationNode): void {
    this.selected = regulation
    if (regulation.TYPE === 'ENTRY') {
      this.location.go('/regulation/' + regulation.ID.toString().replace('-', ''))
      this.getAttachments(regulation)
    }
  }

  getAttachments(regulation: RegulationNode): void {
    this.service.getAttachments(regulation).subscribe(({ root: attachments }) => {
      this.attachments = attachments
    })
  }

  getDocumentUrl(regulation: RegulationNode): string {
    return 'https://docserver.eosksihu.net/F/' + regulation.HASH + '?nodownload'
  }

  hasNestedChild = (_: number, nodeData: RegulationNode) => nodeData.children

  getChildren = (node: RegulationNode) => observableOf(node.children)

  search(value: string): void {
    const clonedTreeLocal = _.cloneDeep(this.clonedTree)
    this.recursiveNodeEliminator(clonedTreeLocal, value)
    this.nestedDataSource = clonedTreeLocal
    this.nestedTreeControl.dataNodes = clonedTreeLocal
    value ? this.nestedTreeControl.expandAll() : this.nestedTreeControl.collapseAll()
  }

  recursiveNodeEliminator(tree: RegulationNode[], search: string): boolean {
    for (let index = tree.length - 1; index >= 0; index--) {
      const node = tree[index]
      if (node.children) {
        const parentCanBeEliminated = this.recursiveNodeEliminator(node.children, search)
        if (parentCanBeEliminated) {
          if (node.TITLE.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) === -1) {
            tree.splice(index, 1)
          }
        }
      } else {
        // Its a leaf node. No more branches.
        if (node.TITLE.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) === -1) {
          tree.splice(index, 1)
        }
      }
    }
    return tree.length === 0
  }

  onAttachmentClick(attachment: RegulationAttachment): void {
    this.selected = {} as RegulationNode
    this.selected.HASH = attachment.hash
    this.selectedAttachment = attachment
  }

  refreshData(): void {
    this.selected = null
    this.nestedDataSource = []
    this.attachments = []
    this.getData()
  }

  editFolder(): void {
    if (!this.selected || this.selected.TYPE !== 'NODE') return this.modalService.showMessage('regulation.folder.choose')
    this.folderForm.reset()
    this.folderForm.controls.id.setValue(this.selected.ID)
    this.folderForm.controls.name.setValue(this.selected.TITLE)
    this.folderForm.controls.description.setValue(this.selected.DESCRIPTION)
    this.folderModal.title = 'common.folder.edit'
    this.modalService.open('regulationFolder')
  }

  newFolder(): void {
    this.folderForm.reset()
    this.folderModal.title = 'common.folder.new'
    this.modalService.open('regulationFolder')
  }

  deleteFolder(): void {
    this.modalService.confirm('Biztos vagy benne?', () => {
      this.service.deleteFolder(this.folderForm.controls.id.value).subscribe(() => {
        this.getData(false)
        this.modalService.close('regulationFolder')
      })
    })
  }

  @FormSubmit('folderForm')
  onFolderFormSubmit(): void {
    let values = this.folderForm.value
    let expanded = this.nestedDataSource.find(e => this.nestedTreeControl.isExpanded(e))
    let parentId = expanded ? expanded.ID : this.selected ? this.selected.PARENT_ID : null
    if (values.id) { // edit
      this.service.editFolder(values.id, values.name, values.description).subscribe(() => {
        this.getData(false)
        this.modalService.close('regulationFolder')
      })
    } else { // new
      this.service.createFolder(parentId, values.name, values.description).subscribe(() => {
        this.getData(false)
        this.modalService.close('regulationFolder')
      })
    }
  }

  newRegulation(): void {
    let expanded = this.nestedDataSource.find(e => this.nestedTreeControl.isExpanded(e))
    let parentId = expanded ? expanded.ID : this.selected ? this.selected.PARENT_ID : null
    if (this.selected && this.selected.TYPE === 'NODE') parentId = this.selected.ID
    if (!parentId) return this.modalService.showMessage('regulation.folder.choose')
    this.newEntry = true
    this.regulationForm.controls.document.setValidators([Validators.required])
    this.regulationForm.reset()
    this.document = null
    this.attachment = null
    this.modalService.open('regulationEntry')
    this.groups.selectedIds = []
  }

  editRegulation(): void {
    if (!this.selected || this.selected.TYPE !== 'ENTRY') return this.modalService.showMessage('regulation.regulation.choose')
    this.newEntry = false
    this.regulationForm.controls.document.setValidators([])
    this.regulationForm.reset()
    this.document = null
    this.attachment = null
    this.groups.selectedIds = []
    let id = this.selected.ID.toString().replace('-', '')
    this.regulationForm.controls.id.setValue(id)
    this.regulationForm.controls.name.setValue(this.selected.TITLE)
    this.regulationForm.controls.description.setValue(this.selected.DESCRIPTION)
    this.regulationForm.controls.public.setValue(Boolean(this.selected.IS_PUBLIC))
    this.groupsModel.proxy.url = '/regulation/group/' + id
    this.groupsModel.load().then(data => {
      data.filter(group => group.selected).map(group => {
        this.groups.selectedIds.push(group.ID)
      })
      this.modalService.open('regulationEntry')
    })
  }

  // regulation form control
  onDocumentChange(files: FileList): void {
    this.document = files.item(0)
    this.regulationForm.controls.document.setValue(this.document.name)
  }

  // regulation form control
  onAttachmentChange(files: FileList): void {
    this.attachment = files.item(0)
    this.regulationForm.controls.attachment.setValue(this.attachment.name)
  }

  @FormSubmit('regulationForm')
  onRegulationFormSubmit(): void {
    let values = this.regulationForm.value
    let expanded = this.nestedDataSource.find(e => this.nestedTreeControl.isExpanded(e))
    let parentId = expanded ? expanded.ID : this.selected ? this.selected.PARENT_ID : null
    if (this.selected && this.selected.TYPE === 'NODE') parentId = this.selected.ID
    let groups = this.groups.selectedIds
    if (!parentId) return this.modalService.showMessage('regulation.folder.choose')
    if (values.id) {
      this.service.updateRegulation(values, parentId, this.document, this.attachment, groups).subscribe(() => {
        this.getData(false)
        this.modalService.close('regulationEntry')
      })
    } else {
      this.service.createRegulation(values, parentId, this.document, this.attachment, groups).subscribe(() => {
        this.getData(false)
        this.modalService.close('regulationEntry')
      })
    }
  }

  deleteRegulation(): void {
    this.modalService.confirm('Biztos vagy benne?', () => {
      this.service.deleteRegulation(this.selected.ID.toString().replace('-', '')).subscribe(() => {
        this.getData(false)
        this.modalService.close('regulationEntry')
      })
    })
  }

  deleteAttachment(): void {
    let selected: ElementRef<HTMLDivElement>
    this.attachmentsRef.forEach(item => {
      if (item.nativeElement.classList.contains('selected')) selected = item
    })
    if (!selected) return this.modalService.showMessage('regulation.attachment.choose')
    this.modalService.confirm('Biztos vagy benne?', () => {
      this.service.deleteAttachment(selected.nativeElement.getAttribute('id')).subscribe(() => {
        this.getData()
      })
    })
  }
}

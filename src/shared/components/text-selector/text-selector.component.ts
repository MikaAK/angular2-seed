import {
  Component,
  EventEmitter,
  ContentChildren,
  HostBinding,
  QueryList,
  Output,
  Input,
  forwardRef,
  Provider
} from '@angular/core'
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms'
import {curry, compose, equals, isNil, prop} from 'ramda'

const setActive = curry((isActive: boolean, object: TextSelectorItem) => object.active = isActive)

const TEXT_SELECTOR_CONTROL_VALUE_ACCESSOR = new Provider(NG_VALUE_ACCESSOR, {
  useExisting: forwardRef(() => TextSelector),
  multi: true
})

@Component({
  selector: 'text-selector',
  templateUrl: './text-selector.pug',
  styleUrls: ['./text-selector.scss'],
  providers: [TEXT_SELECTOR_CONTROL_VALUE_ACCESSOR]
})
export class TextSelector implements ControlValueAccessor {
  @ContentChildren(forwardRef(() => TextSelectorItem)) public selectItems: QueryList<TextSelectorItem>
  @Output() public onClick = new EventEmitter<any>()
  private _onChange: any
  private _onTouch: any

  public registerOnChange(onChangeFn: any) {
    this._onChange = onChangeFn
  }

  public registerOnTouched(onTouchFn: any) {
    this._onTouch = onTouchFn
  }

  public writeValue(value) {
    if (!this.selectItems)
      return
    else if (isNil(value))
      this.selectItems.forEach(setActive(false))

    this._selectItemByValue(value)
  }

  public itemSelected(textItem: TextSelectorItem) {
    this.writeValue(textItem.value)

    if (this._onChange)
      this._onChange(textItem.value)

    this.onClick.emit(textItem.value)
  }

  private _selectItemByValue(value) {
    const isCurrentValue = compose(
      equals(value),
      prop('value')
    )

    this.selectItems.forEach(item => {
      const isActiveItem = isCurrentValue(item)

      if (item.active && !isActiveItem) {
        item.active = false
        item.onDeselect.emit(item.value)
      } else if (isActiveItem) {
        item.active = true
        item.onSelect.emit(item.value)
      }
    })
  }
}

@Component({
  selector: 'text-selector-item',
  templateUrl: './text-selector-item/text-selector-item.pug
  styleUrls: ['./text-selector-item/text-selector-item.scss']
})
export class TextSelectorItem {
  @Input() public value: any
  @Input() public active: boolean
  @Output() public onDeselect = new EventEmitter<any>()
  @Output() public onSelect = new EventEmitter<any>()

  constructor(private _textSelector: TextSelector) {}

  @HostBinding('class.active') public get isActive() {
    return this.active
  }

  public toggleActive() {
    this._textSelector.itemSelected(this)
  }
}

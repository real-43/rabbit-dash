import Select from 'react-select';

const Modal_Selects = (props) => {
    const style = {
        control: styles => ({ ...styles, backgroundColor: 'white', borderRadius: '0px'}),
        option: (styles, { isFocused, isSelected }) => {
            return {
                ...styles,
                backgroundColor: isSelected ? '#9FD3FF' : isFocused ? '#EAF8FF' : null
            };
        },
        placeholder: styles => ({ ...styles, color: '#000000'})
    };
    return (
        <Select onChange={(e) => props.func_setSelect(e, props.setState)} styles={style} placeholder={props.placeholder} options={props.options} />
    )
}
export default Modal_Selects
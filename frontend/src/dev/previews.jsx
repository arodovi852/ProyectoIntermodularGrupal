import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import {Header} from "../components/Header/Header.jsx";
import {Button} from "../components/atoms/Button.jsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Header">
                <Header/>
            </ComponentPreview>
            <ComponentPreview path="/ComponentPreviews">
                <ComponentPreviews/>
            </ComponentPreview>
            <ComponentPreview path="/Button">
                <Button/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews
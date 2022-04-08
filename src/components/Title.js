

const Title = (props) => {
    document.title = "RKB | " + props.children;

    return (
        <>
            <h1 className={'mb-5'}>{props.children}</h1>
        </>
    )
}

export default Title;
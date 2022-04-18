import {Badge, Button, Card, Stack} from "react-bootstrap";
import {db} from "../../db";
import CardModal from "./CardModal";
import {useEffect, useState} from "react";
import ArchivedCardModal from "./ArchivedCardModal";
import {toast} from "react-toastify";
import {VscEdit} from "react-icons/vsc";

const CardCard = (props) => {

    const [labels, setLabels] = useState(undefined);
    const [showCardModal, setShowCardModal] = useState(false);
    const [rerenderCard, setRerenderCard] = useState(0);

    useEffect(() => {
        db.card_labels.where({card_id: props.card.id}).toArray()
            .then(cardLabels => {
                const cardLabelIds = [];
                cardLabels.map(cardLabel => cardLabelIds.push(cardLabel.label_id));
                db.labels.bulkGet(cardLabelIds)
                    .then(setLabels)
                    .catch(toast.error);
            })
            .catch(toast.error);
    }, [props.card])

    return (
        <>
            <Card className={props.className + ' border-1 cardCard'}>
                <Card.Body className={'d-flex px-3 py-2 justify-content-between align-items-center'}>
                    <Stack>
                        <Stack direction={"horizontal"} gap={1}>
                            {
                                labels?.map(label => (
                                    <Badge pill className={'badger'} bg="" style={{backgroundColor: label.color}}>{' '}</Badge>
                                ))
                            }
                        </Stack>
                        <div>
                            {props.card.title}
                        </div>
                    </Stack>

                    <Button
                        className={'description'}
                        variant={'outline-secondary'}
                        size={'sm'}
                        onClick={() => setShowCardModal(true)}
                    >
                        <VscEdit/>
                    </Button>
                </Card.Body>
            </Card>

            {
                props.archived
                    ?
                    <ArchivedCardModal
                        card={props.card}
                        show={showCardModal}
                        onHide={() => setShowCardModal(false)}
                        rerenderColumn={props.rerenderColumn}
                        rerenderBoard={props.rerenderBoard}
                    />
                    :
                    <CardModal
                        card={props.card}
                        show={showCardModal}
                        onHide={() => setShowCardModal(false)}
                        labels={props.labels}
                        rerenderCard={() => setRerenderCard(rerenderCard + 1)}
                        rerenderColumn={props.rerenderColumn}
                        rerenderBoard={props.rerenderBoard}
                        rerenderLabels={props.rerenderLabels}
                    />
            }

        </>
    )
}

export default CardCard;
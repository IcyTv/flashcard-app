import { IonButton } from '@ionic/react';
import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import './FlashCard.scss';

interface FlashCardProps {
    front: JSX.Element;
    back: JSX.Element;
    slot?: string;
    hidden?: boolean;
    onContinue: (correct: boolean, ev?: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) => void;
}

export const FlashCard: React.FC<FlashCardProps> = (props: FlashCardProps) => {
    const [flipped, setFlipped] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const onClick = (correct: boolean) => (ev: React.MouseEvent<HTMLIonButtonElement, MouseEvent>): void => {
        props.onContinue(correct, ev);
    };

    return (
        <div slot={props.slot} className="flashcard" hidden={props.hidden}>
            <ReactCardFlip infinite isFlipped={flipped}>
                <IonButton
                    onClick={(): void => {
                        setFlipped(!flipped);
                        setShowNew(true);
                    }}
                >
                    {props.front}
                </IonButton>
                <IonButton onClick={(): void => setFlipped(!flipped)}>{props.back}</IonButton>
            </ReactCardFlip>
            {showNew && [
                <IonButton className="wrong" key="submit-wrong" onClick={onClick(false)}>
                    Wrong
                </IonButton>,
                <IonButton className="right" key="submit-right" onClick={onClick(true)}>
                    Right
                </IonButton>,
            ]}
        </div>
    );
};

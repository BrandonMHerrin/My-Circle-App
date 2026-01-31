"use client"

import * as React from "react"
import {
    Controller,
    ControllerProps,
    FieldPath,
    FieldValues,
    FormProvider,
    useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"

const Form = FormProvider

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
    name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
    {} as FormFieldContextValue
)

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    ...props
}: ControllerProps<TFieldValues, TName>) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    )
}

const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext)
    const itemContext = React.useContext(FormItemContext)
    const { getFieldState, formState } = useFormContext()

    const fieldState = getFieldState(fieldContext.name, formState)

    if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField>")
    }

    const { id } = itemContext

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    }
}

type FormItemContextValue = {
    id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
    {} as FormItemContextValue
)

const FormItem = ({ className, ...props }: React.ComponentProps<typeof Field>) => {
    const id = React.useId()

    return (
        <FormItemContext.Provider value={{ id }}>
            <Field
                data-slot="form-item"
                className={cn(className)}
                {...props}
            />
        </FormItemContext.Provider>
    )
}

const FormLabel = ({
    className,
    ...props
}: React.ComponentProps<typeof FieldLabel>) => {
    const { formItemId } = useFormField()

    return (
        <FieldLabel
            data-slot="form-label"
            className={cn(className)}
            htmlFor={formItemId}
            {...props}
        />
    )
}

const FormControl = ({ ...props }: React.ComponentProps<"div">) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

    return (
        <FieldContent
            data-slot="form-control"
            id={formItemId}
            aria-describedby={
                !error
                    ? `${formDescriptionId}`
                    : `${formDescriptionId} ${formMessageId}`
            }
            aria-invalid={!!error}
            {...props}
        />
    )
}

const FormDescription = ({
    className,
    ...props
}: React.ComponentProps<typeof FieldDescription>) => {
    const { formDescriptionId } = useFormField()

    return (
        <FieldDescription
            data-slot="form-description"
            id={formDescriptionId}
            className={cn(className)}
            {...props}
        />
    )
}

const FormMessage = ({
    className,
    children,
    ...props
}: React.ComponentProps<typeof FieldError>) => {
    const { error, formMessageId } = useFormField()
    const body = error ? String(error?.message) : children

    if (!body) {
        return null
    }

    return (
        <FieldError
            data-slot="form-message"
            id={formMessageId}
            className={cn(className)}
            errors={error ? [error] : undefined}
            {...props}
        >
            {body}
        </FieldError>
    )
}

export {
    useFormField,
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
}

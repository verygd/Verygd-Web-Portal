from rest_framework import serializers
from project.models import Project
from users.models import PrivateProjectLimitReachedException


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        exclude = ('owner', )
        extra_kwargs = {'password': {'write_only': True}}

    public = serializers.NullBooleanField(required=False)

    def to_representation(self, instance):
        model_dict = super(ProjectSerializer, self).to_representation(instance)
        model_dict['content'] = []

        model_dict['created_by'] = {
            'id': instance.owner.pk,
            'name': str(instance.owner)
        }

        for content in instance.content:
            content_serializer = content.serializer(content, context=self.context)

            content_metadatum = content_serializer.data

            model_dict['content'].append(content_metadatum)

        return model_dict

    def update(self, instance, validated_data):
        # remove password if setting to public
        if 'public' in validated_data and validated_data['public'] and instance.private:
            validated_data['password'] = None

        if 'password' in validated_data and validated_data['password']:
            # hash the new password
            validated_data['password'] = instance.__class__.hash_password(validated_data['password'])

        return super(ProjectSerializer, self).update(instance, validated_data)

    def create(self, validated_data):
        # the owner param is implicit
        validated_data['owner'] = self.context['request'].member

        try:
            project = validated_data['owner'].create_project(Project, **validated_data)
        except PrivateProjectLimitReachedException as e:
            raise serializers.ValidationError({'error': str(e), 'code': 'project_limit_reached'})

        return project
